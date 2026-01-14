from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from users.permissions import IsAdminPrin

from .models import Regulation
from .serializers import (
    RegulationSerializer,
    RegulationListSerializer,
    RegulationAdminListSerializer,
    RegulationAdminGeneralSerializer
)


class RegulationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Regulation.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return RegulationListSerializer
        return RegulationSerializer

    def get_queryset(self):
        queryset = Regulation.objects.filter(estado="vigente").select_related(
            'pdf').order_by("-fecha_publicacion")
        return queryset


class RegulationAdminViewSet(viewsets.ModelViewSet):
    queryset = Regulation.objects.all()
    permission_classes = [IsAdminPrin]

    def get_serializer_class(self):
        if self.action == 'list':
            return RegulationAdminListSerializer

        return RegulationAdminGeneralSerializer

    def get_queryset(self):
        return super().get_queryset().order_by('-fecha_publicacion')

    def destroy(self, request, *args, **kwargs):
        regulation = self.get_object()
        if regulation.pdf:
            pdf = regulation.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            regulation.pdf = None
            regulation.save()
            pdf.delete()
        return super().destroy(request, *args, **kwargs)
