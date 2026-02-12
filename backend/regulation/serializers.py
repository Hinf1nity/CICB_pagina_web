from rest_framework import serializers
from .models import Regulation
from PDFs.serializers import PDFSerializer


class RegulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regulation
        fields = '__all__'


class RegulationListSerializer(serializers.ModelSerializer):
    pdf = PDFSerializer(read_only=True)

    class Meta:
        model = Regulation
        exclude = [
            'estado',
        ]


class RegulationAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regulation
        exclude = [
            'pdf',
        ]


class RegulationAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regulation
        fields = '__all__'
