from rest_framework import serializers
from .models import ResourceChart

class ResourceChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceChart
        fields = '__all__'
