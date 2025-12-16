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
        exclude = ['descripcion']

class NewsAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class NewsAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['imagen'] 

class NewsAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        exclude = ['imagen']