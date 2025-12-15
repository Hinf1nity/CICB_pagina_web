from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = [
            'descripcion',
            'pdf',
        ]


class JobDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
