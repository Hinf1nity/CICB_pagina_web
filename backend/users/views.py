from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from utils.s3 import s3_client
import os


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsAdminUser],
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
            ExpiresIn=300,  # 5 minutos
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
            img = None
            user.save()
            img.delete()

        return super().destroy(request, *args, **kwargs)
