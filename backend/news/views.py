from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.conf import settings
from utils.s3 import s3_client
from rest_framework.permissions import AllowAny, IsAdminUser
from PDFs.models import PDF
from .models import Img
from .models import News
from .serializers import (
    NewsAdminDetailSerializer,
    NewsAdminListSerializer,
    NewsDetailSerializer,
    NewsListSerializer,
    NewsAdminGeneralSerializer
)
import os


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListSerializer
        return NewsDetailSerializer

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf-download",
    )
    def get_pdf(self, request, pk=None):
        new = self.get_object()

        if not new.pdf:
            return Response(
                {"error": "Este Job no tiene un PDF asociado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        pdf: PDF = new.pdf

        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": pdf.ruta,
                "ResponseContentType": "application/pdf",
                "ResponseContentDisposition": "inline",
                # "attachment; filename=archivo.pdf" → forzar descarga
            },
            ExpiresIn=300,  # 5 minutos
        )
        presigned_url = presigned_url.replace(
            settings.AWS_S3_INTERNAL_ENDPOINT,
            settings.AWS_S3_EXTERNAL_ENDPOINT,
        )

        return Response(
            {
                "download_url": presigned_url,
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="img-download",
    )
    def get_img(self, request, pk=None):
        new = self.get_object()

        if not new.imagen:
            return Response(
                {"error": "Este Job no tiene una imagen asociada"},
                status=status.HTTP_404_NOT_FOUND,
            )

        img: Img = new.imagen
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": img.ruta,
                "ResponseContentType": "application/octet-stream",
                "ResponseContentDisposition": f"inline; filename={os.path.basename(img.ruta)}",
                # "attachment; filename=archivo.jpg" → forzar descarga
            },
            ExpiresIn=300,  # 5 minutos
        )
        presigned_url = presigned_url.replace(
            settings.AWS_S3_INTERNAL_ENDPOINT,
            settings.AWS_S3_EXTERNAL_ENDPOINT,
        )

        return Response(
            {
                "download_url": presigned_url,
            },
            status=status.HTTP_200_OK,
        )


class NewsAdminViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsAdminListSerializer

        elif self.action == 'retrieve':
            return NewsAdminDetailSerializer

        return NewsAdminGeneralSerializer
