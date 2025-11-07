from rest_framework import serializers
from .models import PerformanceChart

class PerformanceChartSerializer(serializers.ModelSerializer):
    recurso_nombre = serializers.ReadOnlyField(source='recurso.nombre')

    class Meta:
        model = PerformanceChart
        fields = ['id', 'tarea', 'unidad', 'recurso', 'recurso_nombre', 'cantidad']
