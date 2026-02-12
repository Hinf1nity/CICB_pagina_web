from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = [
            'sobre_empresa',
            'descripcion',
            'pdf',
        ]


class JobDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'estado', 'fecha_publicacion',
                  'nombre_empresa', 'titulo']


class JobAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
