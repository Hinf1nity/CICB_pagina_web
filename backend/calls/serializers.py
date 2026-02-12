from rest_framework import serializers
from .models import Call
from PDFs.serializers import PDFSerializer


class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = '__all__'


class CallListSerializer(serializers.ModelSerializer):
    pdf = PDFSerializer(read_only=True)

    class Meta:
        model = Call
        exclude = [
            'estado',
        ]


class CallAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        exclude = [
            'pdf',
        ]


class CallAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = '__all__'
