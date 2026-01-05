from rest_framework import serializers
from .models import Yearbook

class YearbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yearbook
        fields = '__all__'

class YearbookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yearbook
        exclude = [
            'estado',
        ]