from rest_framework import serializers
from .models import Elemento, IncidenciasLaborales, Categoria, Nivel
from django.core.cache import cache
from django.db import transaction


class ElementoSerializer(serializers.Serializer):
    detalle = serializers.CharField(allow_blank=True, required=False)
    valor = serializers.FloatField(required=False)
    unidad = serializers.CharField(allow_blank=True, required=False)


class NivelSerializer(serializers.Serializer):
    nombre = serializers.CharField(allow_blank=True, required=False)
    elementos = ElementoSerializer(many=True)  # N elementos


class CategoriaSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    niveles = NivelSerializer(many=True)  # N niveles


class CalculateArancelesSerializer(serializers.Serializer):
    DEPARTAMENTOS = [
        ('La Paz', 'La Paz'),
        ('Cochabamba', 'Cochabamba'),
        ('Santa Cruz', 'Santa Cruz'),
        ('Oruro', 'Oruro'),
        ('Potosí', 'Potosí'),
        ('Tarija', 'Tarija'),
        ('Chuquisaca', 'Chuquisaca'),
        ('Beni', 'Beni'),
        ('Pando', 'Pando'),
    ]

    def get_formacion_choices(self):
        # Usamos .distinct() por si acaso hay duplicados
        choices = cache.get('formacion_choices')
        if not choices:
            nombres = IncidenciasLaborales.objects.all()
            choices = [(n.nombre.replace('form_', ''), n.nombre.replace(
                'form_', '').capitalize()) for n in nombres if n.nombre.startswith('form_')]
            cache.set('formacion_choices', choices,
                      timeout=60*60)  # Cache por 1 hora
        return choices

    UBICACION = [
        ('ciudad', 'Ciudad'),
        ('campo', 'Campo'),
    ]
    antiguedad = serializers.IntegerField(write_only=True)
    departamento = serializers.ChoiceField(
        choices=DEPARTAMENTOS, write_only=True)
    formacion = serializers.ChoiceField(
        choices=[], write_only=True)
    ubicacion = serializers.ChoiceField(choices=UBICACION, write_only=True)
    actividad = serializers.CharField(write_only=True)
    mensual = serializers.FloatField(read_only=True)
    diario = serializers.FloatField(read_only=True)
    hora = serializers.FloatField(read_only=True)

    trabajos = CategoriaSerializer(many=True, read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Actualizamos las opciones de formación dinámicamente
        self.fields['formacion'].choices = self.get_formacion_choices()

    def validate(self, data):
        mensual, hora, dia = self.calculate_arancel_mes_dia_hora(data)

        data['mensual'] = mensual
        data['hora'] = hora
        data['diario'] = dia

        query_trabajos = Categoria.objects.all()
        trabajos_data = CategoriaSerializer(query_trabajos, many=True).data
        for trabajo in trabajos_data:
            for nivel in trabajo['niveles']:
                for elemento in nivel['elementos']:
                    valor_base = float(elemento['valor'])
                    elemento['valor'] = round(valor_base * hora, 0)
        data['trabajos'] = trabajos_data
        return super().validate(data)

    def calculate_arancel_mes_dia_hora(self, data):
        # Obtener todos los datos en una sola petición a la base de datos
        nombres_requeridos = [
            'salario_mensual_base', 'ipc_nacional',
            f"fce_{data['departamento']}", f"ipc_{data['departamento']}",
            f"form_{data['formacion']}", f"actividad_{data['actividad']}",
            "ant_junior_min", "ant_junior_max",
            "ant_pleno_min", "ant_pleno_max",
            "ant_senior_min", "ant_senior_max"
        ]

        datos = IncidenciasLaborales.objects.filter(
            nombre__in=nombres_requeridos
        ).values('nombre', 'valor')

        datos_dict = {item['nombre']: float(item['valor']) for item in datos}

        salario_base = datos_dict['salario_mensual_base']
        ipc_nacional = datos_dict['ipc_nacional']
        fce_departamento = datos_dict[f"fce_{data['departamento']}"]
        ipc_departamento = datos_dict[f"ipc_{data['departamento']}"]
        factor_formacion = datos_dict[f"form_{data['formacion']}"]
        factor_tipo_actividad = datos_dict[f"actividad_{data['actividad']}"]

        min_junior = datos_dict["ant_junior_min"]
        max_junior = datos_dict["ant_junior_max"]
        min_pleno = datos_dict["ant_pleno_min"]
        max_pleno = datos_dict["ant_pleno_max"]
        min_senior = datos_dict["ant_senior_min"]
        max_senior = datos_dict["ant_senior_max"]
        if (data['antiguedad'] <= min_junior):
            antiguedad = 'junior'
        elif (min_junior < data['antiguedad'] <= max_junior):
            antiguedad = 'junior'
        elif (min_pleno <= data['antiguedad'] <= max_pleno):
            antiguedad = 'pleno'
        elif (min_senior <= data['antiguedad'] <= max_senior):
            antiguedad = 'senior'
        factor_antiguedad = IncidenciasLaborales.objects.get(
            nombre=f"ant_{antiguedad}_{data['ubicacion'].lower()}").valor
        factor_departamental = round(float(
            fce_departamento) * (float(ipc_departamento) / float(ipc_nacional)), 2)
        arancel_calculado = float(salario_base) * float(factor_antiguedad) * float(factor_formacion) * \
            float(factor_departamental) * float(factor_tipo_actividad)
        arancel_calculado = round(arancel_calculado, 0)
        arancel_hora = round(arancel_calculado / 240, 0)
        arancel_dia = round(arancel_hora * 8, 0)
        return arancel_calculado, arancel_hora, arancel_dia


class IncidenciasAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidenciasLaborales
        fields = '__all__'


class CategoriaAdminSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField()
    niveles = NivelSerializer(many=True)

    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'niveles']

    def create(self, validated_data):
        # 1. Extraemos los niveles antes de crear la categoría
        niveles_data = validated_data.pop('niveles', [])

        # Usamos una transacción atómica para asegurar que
        # o se crea todo el "árbol" de datos o no se crea nada.
        with transaction.atomic():
            # 2. Creamos la categoría base
            categoria_instance = Categoria.objects.create(**validated_data)

        return categoria_instance

    def update(self, instance, validated_data):
        niveles_data = validated_data.pop('niveles', [])
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()

        with transaction.atomic():
            # --- Lógica para NIVELES ---
            # Identificamos qué niveles vienen en la petición (por nombre o ID)
            nombres_niveles_recibidos = [n.get('nombre') for n in niveles_data]

            # Opcional: Borrar niveles que ya no están en la lista
            instance.niveles.exclude(
                nombre__in=nombres_niveles_recibidos).delete()
            for nivel_data in niveles_data:
                elementos_data = nivel_data.pop('elementos', [])

                # OJO: Si buscas solo por nombre, podrías duplicar si el usuario
                # cambia el nombre en el frontend. Lo ideal es usar IDs.
                nivel_obj, _ = Nivel.objects.update_or_create(
                    categoria=instance,
                    nombre=nivel_data.get('nombre'),
                    defaults=nivel_data
                )

                detalles_elementos_recibidos = [
                    e.get('detalle') for e in elementos_data]
                # Opcional: Borrar elementos que ya no están en la lista
                nivel_obj.elementos.exclude(
                    detalle__in=detalles_elementos_recibidos).delete()

                for elemento_data in elementos_data:
                    Elemento.objects.update_or_create(
                        nivel=nivel_obj,
                        detalle=elemento_data.get('detalle'),
                        defaults=elemento_data
                    )

        return instance
