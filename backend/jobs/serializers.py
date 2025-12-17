from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = [
            'descripcion',
            'spobre_empresa',
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
        fields = ['imagen']


class JobAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ['imagen']
