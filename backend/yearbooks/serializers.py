from rest_framework import serializers
from .models import Yearbook
from PDFs.serializers import PDFSerializer


class YearbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yearbook
        fields = '__all__'


class YearbookListSerializer(serializers.ModelSerializer):
    pdf = PDFSerializer(read_only=True)

    class Meta:
        model = Yearbook
        exclude = [
            'estado',
        ]


class YearbookAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yearbook
        exclude = [
            'pdf',
        ]


class YearbookAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yearbook
        fields = '__all__'
