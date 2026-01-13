from rest_framework import serializers
from .models import PerformanceTable, QuantifiedResource

from resource_chart.models import ResourceChart

class QuantifiedResourceInputSerializer(serializers.Serializer):
    resource_id = serializers.IntegerField()
    cantidad = serializers.CharField(max_length=255)

class QuantifiedResourceDetailSerializer(serializers.ModelSerializer):
    resource_id = serializers.ReadOnlyField(source='resource.id')
    nombre = serializers.ReadOnlyField(source='resource.nombre')
    unidad_recurso = serializers.ReadOnlyField(source='resource.unidad')

    class Meta:
        model = QuantifiedResource
        fields = ['resource_id', 'nombre', 'unidad_recurso', 'cantidad']

    
class PerformanceTableSerializer(serializers.ModelSerializer):
    recursos_info = QuantifiedResourceInputSerializer(many=True, write_only=True)

    recursos_detalles = QuantifiedResourceDetailSerializer(
        source='quantifiedresource_set', 
        many=True, 
        read_only=True
    )

    class Meta:
        model = PerformanceTable
        fields = [
            'id', 
            'codigo', 
            'actividad', 
            'unidad', 
            'recursos_info',
            'recursos_detalles'
        ]

    def create(self, validated_data):
        recursos_data = validated_data.pop('recursos_info')
        performance_table = PerformanceTable.objects.create(**validated_data)

        for item in recursos_data:
            resource_obj = ResourceChart.objects.get(id=item['resource_id'])
            QuantifiedResource.objects.create(
                performance_table=performance_table,
                resource=resource_obj,
                cantidad=item['cantidad']
            )

        return performance_table