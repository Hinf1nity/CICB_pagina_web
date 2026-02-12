from rest_framework import serializers
from .models import News
from IMGs.serializers import IMGSerializer


class NewsListSerializer(serializers.ModelSerializer):
    imagen = IMGSerializer()

    class Meta:
        model = News
        exclude = [
            'descripcion',
            'pdf',
        ]


class NewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        exclude = ['resumen']


class NewsAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'


class NewsAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'estado', 'fecha_publicacion', 'categoria', 'titulo']


class NewsAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
