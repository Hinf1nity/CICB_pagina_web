from rest_framework import serializers
from .models import PerformanceTable

class PerformanceTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceTable
        fields = '__all__'