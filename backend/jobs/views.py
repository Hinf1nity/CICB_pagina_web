from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.conf import settings
from utils.s3 import s3_client
from PDFs.models import PDF
from .models import Job
from .serializers import (
    JobListSerializer,
    JobDetailSerializer,
    JobAdminGeneralSerializer,
    JobAdminDetailSerializer,
    JobAdminListSerializer
)
from users.permissions import IsAdminPrin
from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):
    page_size = 20


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    # queryset = Job.objects.all()
    permission_classes = [AllowAny]
    pagination_class = TwentyPerPagePagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['titulo']

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobDetailSerializer

    def get_queryset(self):
        queryset = Job.objects.filter(
            estado='publicado').order_by('-fecha_publicacion')
        return queryset

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf-download",
    )
    def get_pdf(self, request, pk=None):
        job = self.get_object()

        if not job.pdf:
            return Response(
                {"error": "Este Job no tiene un PDF asociado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        pdf: PDF = job.pdf

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


class JobAdminViewSet(viewsets.ModelViewSet):
    # queryset = Job.objects.all()
    permission_classes = [IsAdminPrin]
    pagination_class = TwentyPerPagePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return JobAdminListSerializer

        elif self.action == 'retrieve':
            return JobAdminDetailSerializer

        return JobAdminGeneralSerializer

    def get_queryset(self):
        queryset = Job.objects.all().order_by('-fecha_publicacion')
        return queryset

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.pdf:
            pdf = job.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            job.pdf = None
            job.save()
            pdf.delete()
        return super().destroy(request, *args, **kwargs)
