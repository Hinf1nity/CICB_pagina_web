from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from users.permissions import IsAdminPrin

from .models import Call
from .serializers import (
    CallSerializer,
    CallListSerializer,
    CallAdminListSerializer,
    CallAdminGeneralSerializer
)


class CallViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Call.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return CallListSerializer
        return CallSerializer

    def get_queryset(self):
        queryset = Call.objects.filter(estado="activa").select_related(
            'pdf').order_by("-fecha_publicacion")
        return queryset


class CallAdminViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    permission_classes = [IsAdminPrin]

    def get_serializer_class(self):
        if self.action == 'list':
            return CallAdminListSerializer

        return CallAdminGeneralSerializer

    def get_queryset(self):
        return super().get_queryset().order_by('-fecha_publicacion')

    def destroy(self, request, *args, **kwargs):
        call = self.get_object()
        if call.pdf:
            pdf = call.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            call.pdf = None
            call.save()
            pdf.delete()
        return super().destroy(request, *args, **kwargs)
