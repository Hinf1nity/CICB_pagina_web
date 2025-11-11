from rest_framework import serializers
from .models import Regulation

class RegulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regulation
        fields = '__all__'
