from rest_framework import serializers
from .models import Img

class IMGSerializer(serializers.ModelSerializer):
    class Meta:
        model = Img
        fields = ['id', 'ruta']
