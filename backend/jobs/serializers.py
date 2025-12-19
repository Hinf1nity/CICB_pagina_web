from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = [
            'descripcion',
            'sobre_empresa',
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
        fields = '__all__'


class JobAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
