from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminPrin
from utils.s3 import s3_client
from django.conf import settings
from .models import VirtualLibrary
from .serializers import (
    VirtualLibrarySerializer,
    VirtualLibraryListSerializer,
    VirtualLibraryAdminListSerializer,
    VirtualLibraryAdminGeneralSerializer
)
from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class TwentyPerPagePaginationAdmin(PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        queryset = VirtualLibrary.objects.all()
        published_count = queryset.filter(estado="publicado").count()
        draft_count = queryset.filter(estado="borrador").count()
        archive_count = queryset.filter(estado="archivado").count()
        return Response({
            'count': self.page.paginator.count,
            'published_count': published_count,
            'draft_count': draft_count,
            'archive_count': archive_count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })


class VirtualLibraryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    pagination_class = TwentyPerPagePagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['categoria']
    search_fields = ['autor', 'anio']

    def get_serializer_class(self):
        if self.action == 'list':
            return VirtualLibraryListSerializer
        return VirtualLibrarySerializer

    def get_queryset(self):
        queryset = VirtualLibrary.objects.filter(estado="publicado").select_related(
            'pdf').order_by("-anio")
        return queryset


class VirtualLibraryAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminPrin]
    pagination_class = TwentyPerPagePaginationAdmin
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['categoria']
    search_fields = ['autor', 'anio']

    def get_serializer_class(self):
        if self.action == 'list':
            return VirtualLibraryAdminListSerializer

        return VirtualLibraryAdminGeneralSerializer

    def get_queryset(self):
        queryset = VirtualLibrary.objects.all().order_by('-anio')
        return queryset

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf-download",
        permission_classes=[IsAdminPrin],
    )
    def get_pdf(self, request, pk=None):
        virtual_library = self.get_object()

        if not virtual_library.pdf:
            return Response(
                {"error": "Este Job no tiene un PDF asociado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        pdf: PDF = virtual_library.pdf

        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": pdf.ruta,
                "ResponseContentType": "application/pdf",
                "ResponseContentDisposition": "inline",
            },
            ExpiresIn=300,  # 5 minutos
        )

        return Response(
            {
                "download_url": presigned_url,
                "pdf_id": pdf.id,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        virtual_library = self.get_object()
        if virtual_library.pdf:
            pdf = virtual_library.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            pdf.delete()
        self.perform_destroy(virtual_library)
        return Response(status=status.HTTP_204_NO_CONTENT)
