from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from users.permissions import IsAdminPrin

from .models import Yearbook
from .serializers import (
    YearbookSerializer,
    YearbookListSerializer,
    YearbookAdminListSerializer,
    YearbookAdminGeneralSerializer
)


class YearbookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Yearbook.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return YearbookListSerializer
        return YearbookSerializer

    def get_queryset(self):
        queryset = Yearbook.objects.filter(estado="publicado").select_related(
            'pdf').order_by("-fecha_publicacion")
        return queryset


class YearbookAdminViewSet(viewsets.ModelViewSet):
    queryset = Yearbook.objects.all()
    permission_classes = [IsAdminPrin]

    def get_serializer_class(self):
        if self.action == 'list':
            return YearbookAdminListSerializer

        return YearbookAdminGeneralSerializer

    def get_queryset(self):
        return super().get_queryset().order_by('-fecha_publicacion')

    def destroy(self, request, *args, **kwargs):
        yearbook = self.get_object()
        if yearbook.pdf:
            pdf = yearbook.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            yearbook.pdf = None
            yearbook.save()
            pdf.delete()
        return super().destroy(request, *args, **kwargs)
