from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import Img
from .serializers import IMGSerializer
from utils.s3 import s3_client
import uuid
from users.permissions import IsAdminPrin, IsAdminSec, IsUser


class IMGViewSet(viewsets.GenericViewSet):
    queryset = Img.objects.all()
    serializer_class = IMGSerializer

    @action(
        detail=False,
        methods=["post"],
        url_path="img-presigned-url",
        permission_classes=[IsAuthenticated],
    )
    def generate_image_presigned_url(self, request):
        file_name = request.data.get("file_name")
        content_type = request.data.get("content_type")

        if not file_name or not content_type:
            return Response(
                {"error": "file_name y content_type son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if content_type not in allowed_types:
            return Response(
                {"error": "Solo se permiten imágenes (JPEG, PNG, GIF, WebP)"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ext = file_name.lower().split(".")[-1]
        if ext not in ["jpg", "jpeg", "png", "gif", "webp"]:
            return Response(
                {"error": "El archivo debe tener extensión de imagen válida"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ruta = f"imgs/{uuid.uuid4()}.{ext}"

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": ruta,
                "ContentType": content_type
            },
            ExpiresIn=300,
        )

        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )

        img = Img.objects.create(
            ruta=ruta,
        )

        return Response(
            {
                "upload_url": presigned_url,
                "img_id": img.id,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="img-presigned-update",
        permission_classes=[IsAuthenticated],
    )
    def update_img_presigned(self, request, pk=None):
        file = self.get_object()

        if not file.ruta:
            return Response(
                {"error": "Este archivo no esta guardado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        content_type = request.data.get("content_type")

        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if content_type not in allowed_types:
            return Response(
                {"error": "Solo se permiten imágenes (JPEG, PNG, GIF, WebP)"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ruta = file.ruta

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": ruta,
                "ContentType": content_type,
            },
            ExpiresIn=300,
        )

        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )

        return Response(
            {
                "upload_url": presigned_url,
            },
            status=status.HTTP_200_OK,
        )
