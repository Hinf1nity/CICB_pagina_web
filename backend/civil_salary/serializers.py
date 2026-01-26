from rest_framework import serializers
from .models import IncidenciasLaborales, CategoriaRendimiento, ItemRendimiento


class IncidenciasLaboralesSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidenciasLaborales
        fields = '__all__'


class ItemRendimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemRendimiento
        fields = '__all__'


class CategoriaRendimientoSerializer(serializers.ModelSerializer):
    items = ItemRendimientoSerializer(many=True, read_only=True)

    class Meta:
        model = CategoriaRendimiento
        fields = ['id', 'nombre', 'items']


class ArancelesPostSerializer(serializers.Serializer):
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
    FORMACION_ACADEMICA = [
        ('licenciatura', 'Licenciatura'),
        ('diplomado', 'Diplomado'),
        ('maestria', 'Maestría'),
        ('doctorado', 'Doctorado'),
    ]
    UBICACION = [
        ('ciudad', 'Ciudad'),
        ('campo', 'Campo'),
    ]
    ACTIVIDAD = [
        ('diseño', 'Diseño'),
        ('supervisión', 'Supervisión'),
        ('avaluo', 'Avalúo'),
    ]
    antiguedad = serializers.IntegerField()
    departamento = serializers.ChoiceField(choices=DEPARTAMENTOS)
    formacion = serializers.ChoiceField(choices=FORMACION_ACADEMICA)
    ubicacion = serializers.ChoiceField(choices=UBICACION)
    actividad = serializers.ChoiceField(choices=ACTIVIDAD)

    class Meta:
        fields = [
            'antiguedad',
            'departamento',
            'formacion',
            'ubicacion',
            'actividad',
        ]
