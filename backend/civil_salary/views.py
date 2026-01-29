from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CalculateArancelesSerializer
from .models import IncidenciasLaborales


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
