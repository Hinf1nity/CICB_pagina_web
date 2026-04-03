from rest_framework import serializers
from .models import VirtualLibrary
from PDFs.serializers import PDFSerializer


class VirtualLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualLibrary
        fields = '__all__'


class VirtualLibraryListSerializer(serializers.ModelSerializer):
    pdf = PDFSerializer(read_only=True)

    class Meta:
        model = VirtualLibrary
        exclude = [
            'estado',
        ]


class VirtualLibraryAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualLibrary
        exclude = [
            'pdf',
        ]


class VirtualLibraryAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualLibrary
        fields = '__all__'
