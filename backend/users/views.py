from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from utils.s3 import s3_client
import os

from .models import UsuarioComun
from .serializers import UsuarioComunSerializer, UsuarioComunListSerializer
from .permissions import IsAdminPrin, IsAdminSec, IsUser

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioComunSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create", "update", "partial_update", "destroy"]:
            user = self.request.user
            if user.is_superuser:
                return [IsAdminPrin()]
            elif getattr(user, "rol", None) == "admin_ciudad":
                return [IsAdminSec()]
            else:
                return [IsUser()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return UsuarioComunListSerializer
        return UsuarioComunSerializer

    def get_queryset(self):
        user = self.request.user
        qs = UsuarioComun.objects.all()

        if user.is_superuser:
            return qs
        if getattr(user, "rol", None) == "admin_ciudad":
            return qs.filter(departamento=user.ciudad)
        return qs.filter(id=user.id)

    @action(
        detail=True,
        methods=["get"],
        url_path="img-download",
    )
    def get_img(self, request, pk=None):
        user = self.get_object()

        if not user.imagen:
            return Response(
                {"error": "Este usuario no tiene una imagen asociada"},
                status=status.HTTP_404_NOT_FOUND,
            )

        img = user.imagen

        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": img.ruta,
                "ResponseContentType": "application/octet-stream",
                "ResponseContentDisposition": f"inline; filename={os.path.basename(img.ruta)}",
            },
            ExpiresIn=300,
        )

        return Response({
            "download_url": presigned_url,
            "img_id": img.id,
        })

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        if user.imagen:
            img = user.imagen
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=img.ruta
            )
            img.delete()
            user.imagen = None
            user.save()

        return super().destroy(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if getattr(user, "rol", None) != "admin_ciudad" and not user.is_superuser:
            if instance != user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("No puedes modificar otro usuario")

        return super().partial_update(request, *args, **kwargs)