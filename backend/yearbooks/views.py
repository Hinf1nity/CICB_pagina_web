from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminPrin
from utils.s3 import s3_client
from django.conf import settings
from .models import Yearbook
from .serializers import (
    YearbookSerializer,
    YearbookListSerializer,
    YearbookAdminListSerializer,
    YearbookAdminGeneralSerializer
)
from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class TwentyPerPagePaginationAdmin(PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        queryset = Yearbook.objects.all()
        published_count = queryset.filter(estado="publicado").count()
        draft_count = queryset.filter(estado="borrador").count()
        return Response({
            'count': self.page.paginator.count,
            'published_count': published_count,
            'draft_count': draft_count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })


class YearbookViewSet(viewsets.ReadOnlyModelViewSet):
    # queryset = Yearbook.objects.all()
    permission_classes = [AllowAny]
    pagination_class = TwentyPerPagePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return YearbookListSerializer
        return YearbookSerializer

    def get_queryset(self):
        queryset = Yearbook.objects.filter(estado="publicado").select_related(
            'pdf').order_by("-fecha_publicacion")
        return queryset


class YearbookAdminViewSet(viewsets.ModelViewSet):
    # queryset = Yearbook.objects.all()
    permission_classes = [IsAdminPrin]
    pagination_class = TwentyPerPagePaginationAdmin
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nombre', 'fecha_publicacion']

    def get_serializer_class(self):
        if self.action == 'list':
            return YearbookAdminListSerializer

        return YearbookAdminGeneralSerializer

    def get_queryset(self):
        queryset = Yearbook.objects.all().order_by('-fecha_publicacion')
        return queryset

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf-download",
        permission_classes=[IsAdminPrin],
    )
    def get_pdf(self, request, pk=None):
        yearbook = self.get_object()

        if not yearbook.pdf:
            return Response(
                {"error": "Este Job no tiene un PDF asociado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        pdf: PDF = yearbook.pdf

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
