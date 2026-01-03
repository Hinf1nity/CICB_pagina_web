from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from utils.s3 import s3_client
import os

from .models import UsuarioComun
from .serializers import UsuarioComunSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = UsuarioComun.objects.all()
    serializer_class = UsuarioComunSerializer
    permission_classes = [IsAuthenticated]

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
