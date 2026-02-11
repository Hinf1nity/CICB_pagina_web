from rest_framework import serializers
from .models import IncidenciasLaborales, Categoria
from django.core.cache import cache


class ElementoSerializer(serializers.Serializer):
    detalle = serializers.CharField()
    valor = serializers.FloatField()
    unidad = serializers.CharField()


class NivelSerializer(serializers.Serializer):
    nombre = serializers.CharField()
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
        if (data['antiguedad'] <= 5):
            antiguedad = 'junior'
        elif (5 < data['antiguedad'] <= 15):
            antiguedad = 'pleno'
        else:
            antiguedad = 'senior'
        salario_base = IncidenciasLaborales.objects.get(
            nombre='salario_mensual_base').valor
        ipc_nacional = IncidenciasLaborales.objects.get(
            nombre='ipc_nacional').valor
        fce_departamento = IncidenciasLaborales.objects.get(
            nombre=f"fce_{data['departamento']}").valor
        ipc_departamento = IncidenciasLaborales.objects.get(
            nombre=f"ipc_{data['departamento']}").valor
        factor_formacion = IncidenciasLaborales.objects.get(
            nombre=f"form_{data['formacion']}").valor
        factor_antiguedad = IncidenciasLaborales.objects.get(
            nombre=f"{antiguedad}_{data['ubicacion'].lower()}").valor
        factor_tipo_actividad = IncidenciasLaborales.objects.get(
            nombre=f"actividad_{data['actividad']}").valor
        factor_departamental = round(float(
            fce_departamento) * (float(ipc_departamento) / float(ipc_nacional)), 2)
        arancel_calculado = float(salario_base) * float(factor_antiguedad) * float(factor_formacion) * \
            float(factor_departamental) * float(factor_tipo_actividad)
        arancel_calculado = round(arancel_calculado, 0)
        arancel_hora = round(arancel_calculado / 240, 0)
        arancel_dia = round(arancel_hora * 8, 0)
        return arancel_calculado, arancel_hora, arancel_dia
