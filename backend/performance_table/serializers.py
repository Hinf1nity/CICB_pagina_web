from rest_framework import serializers
from .models import PerformanceTable, QuantifiedResource, ResourceChart
from django.db import transaction


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceChart
        fields = ['id', 'nombre', 'unidad', 'categoria']


class PerformanceResourceSerializer(serializers.ModelSerializer):
    recurso_detallado = ResourceSerializer(source='recurso', read_only=True)

    class Meta:
        model = QuantifiedResource
        fields = ['recurso', 'cantidad', 'recurso_detallado']
        extra_kwargs = {
            'recurso': {'write_only': True}
        }


class PerformanceTableSerializer(serializers.ModelSerializer):
    recursos_info = PerformanceResourceSerializer(
        source='quantifiedresource_set',
        many=True)

    class Meta:
        model = PerformanceTable
        fields = [
            'id',
            'codigo',
            'actividad',
            'unidad',
            'categoria',
            'recursos_info',
        ]

    def create(self, validated_data):
        recursos_data = validated_data.pop('quantifiedresource_set')
        with transaction.atomic():
            performance_table = PerformanceTable.objects.create(
                **validated_data)

            objs = [
                QuantifiedResource(
                    performance_table=performance_table,
                    recurso=item['recurso'],
                    cantidad=item['cantidad']
                )
                for item in recursos_data
            ]
            QuantifiedResource.objects.bulk_create(objs)

        return performance_table

    def update(self, instance, validated_data):
        recursos_data = validated_data.pop('quantifiedresource_set', None)

        with transaction.atomic():
            # Actualizar campos de la tabla
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if recursos_data is not None:
                instance.quantifiedresource_set.all().delete()
                recursos_objetos = [
                    QuantifiedResource(
                        performance_table=instance,
                        recurso=item['recurso'],
                        cantidad=item['cantidad']
                    )
                    for item in recursos_data
                ]
                QuantifiedResource.objects.bulk_create(recursos_objetos)

        return instance


class PerformanceTablePDFSerializer(serializers.ModelSerializer):
    recursos_detallados = PerformanceResourceSerializer(
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
            'categoria',
            'recursos_info'
        ]
