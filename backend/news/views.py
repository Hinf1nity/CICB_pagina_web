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
from users.permissions import IsUser
import os
from users.permissions import IsAdminPrin
from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    # queryset = News.objects.all()
    permission_classes = [AllowAny]
    pagination_class = TwentyPerPagePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsListSerializer
        return NewsDetailSerializer

    def get_queryset(self):
        queryset = News.objects.filter(estado="publicado").select_related(
            'imagen').order_by("-fecha_publicacion")
        return queryset

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
        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )

        return Response(
            {
                "download_url": presigned_url,
                "pdf_id": pdf.id,
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
        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )

        return Response(
            {
                "download_url": presigned_url,
                "img_id": img.id,
            },
            status=status.HTTP_200_OK,
        )


class NewsAdminViewSet(viewsets.ModelViewSet):
    # queryset = News.objects.all()
    permission_classes = [IsAdminPrin]
    pagination_class = TwentyPerPagePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return NewsAdminListSerializer

        elif self.action == 'retrieve':
            return NewsAdminDetailSerializer

        return NewsAdminGeneralSerializer

    def get_queryset(self):
        queryset = News.objects.all().order_by("-fecha_publicacion")
        return queryset

    def destroy(self, request, *args, **kwargs):
        new = self.get_object()
        if new.pdf:
            pdf = new.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            new.pdf = None
            new.save()
            pdf.delete()
        if new.imagen:
            img = new.imagen
            ruta = img.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            new.imagen = None
            new.save()
            img.delete()
        return super().destroy(request, *args, **kwargs)
