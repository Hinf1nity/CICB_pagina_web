from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .serializers import CalculateArancelesSerializer, CategoriaAdminSerializer, IncidenciasAdminSerializer, CategoriaSerializer
from .models import Categoria, IncidenciasLaborales
from users.permissions import IsAdminPrin


class CalculateArancelViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        formaciones_raw = IncidenciasLaborales.objects.filter(
            nombre__startswith='form_'
        ).values_list('nombre', flat=True).distinct()
        formaciones = [f.replace('form_', '') for f in formaciones_raw]
        actvidades_raw = IncidenciasLaborales.objects.filter(
            nombre__startswith='actividad_'
        ).values_list('nombre', flat=True).distinct()
        actividades = [a.replace('actividad_', '') for a in actvidades_raw]
        return Response({
            "formaciones": formaciones,
            "actividades": actividades,
        })

    def create(self, request):
        serializer = CalculateArancelesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class IncidenciasAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminPrin]
    queryset = IncidenciasLaborales.objects.all()
    serializer_class = IncidenciasAdminSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='bulk-update')
    def bulk_update(self, request):
        data = request.data

        if not isinstance(data, list):
            return Response(
                {"error": "Se esperaba una lista de objetos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ids = [item.get('id') for item in data if item.get('id')]
        data_map = {item['id']: item for item in data}

        queryset = IncidenciasLaborales.objects.filter(id__in=ids)

        updated_objects = []
        fields_to_update = set()

        for obj in queryset:
            item_data = data_map.get(obj.id)
            if 'nombre' in item_data:
                obj.nombre = item_data['nombre']
                fields_to_update.add('nombre')
            if 'valor' in item_data:
                obj.valor = item_data['valor']
                fields_to_update.add('valor')
            updated_objects.append(obj)

        if updated_objects:
            with transaction.atomic():
                IncidenciasLaborales.objects.bulk_update(
                    updated_objects,
                    fields=list(fields_to_update)
                )

        serializer = self.get_serializer(updated_objects, many=True)
        return Response(serializer.data)


class CategoriaAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminPrin]
    queryset = Categoria.objects.prefetch_related('niveles__elementos').all()
    serializer_class = CategoriaAdminSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
