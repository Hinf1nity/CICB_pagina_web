from rest_framework import serializers
from .models import News


class NewsListSerializer(serializers.ModelSerializer):
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


class NewsAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
