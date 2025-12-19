from rest_framework import viewsets, status
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


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobDetailSerializer

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


class JobAdminViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return JobAdminListSerializer

        elif self.action == 'retrieve':
            return JobAdminDetailSerializer

        return JobAdminGeneralSerializer
