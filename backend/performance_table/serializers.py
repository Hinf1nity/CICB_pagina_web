from rest_framework import serializers
from .models import PerformanceTable, QuantifiedResource, ResourceChart
from django.db import transaction


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceChart
        fields = ['id', 'nombre', 'unidad']


class PerformanceResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuantifiedResource
        fields = ['recurso', 'cantidad']


class PerformanceTableSerializer(serializers.ModelSerializer):
    recursos_info = PerformanceResourceSerializer(
        many=True, write_only=True)

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

    def to_representation(self, instance):
        response = super().to_representation(instance)
        recursos = QuantifiedResource.objects.filter(
            performance_table=instance)
        response['recursos_info'] = [
            {
                'recurso': ResourceSerializer(qr.recurso).data,
                'cantidad': qr.cantidad
            }
            for qr in recursos
        ]
        return response

    def create(self, validated_data):
        recursos_data = validated_data.pop('recursos_info')
        performance_table = PerformanceTable.objects.create(**validated_data)

        for item in recursos_data:
            QuantifiedResource.objects.create(
                performance_table=performance_table,
                **item,
            )

        return performance_table

    def update(self, instance, validated_data):
        recursos_data = validated_data.pop('recursos_info', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if recursos_data is not None:
            with transaction.atomic():
                QuantifiedResource.objects.filter(
                    performance_table=instance).delete()
                for item in recursos_data:
                    QuantifiedResource.objects.create(
                        performance_table=instance,
                        **item,
                    )

        return instance
