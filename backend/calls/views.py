from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from users.permissions import IsAdminPrin

from .models import Call
from .serializers import (
    CallSerializer,
    CallListSerializer,
    CallAdminListSerializer,
    CallAdminGeneralSerializer
)

class CallViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Call.objects.all()
    permission_classes = [AllowAny]
        
    def get_serializer_class(self):
        if self.action == 'list':
            return CallListSerializer
        return CallSerializer

    def get_queryset(self):
        return super().get_queryset().filter(estado='publicado').order_by('-fecha_publicacion')
    
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

class CallAdminViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all()
    permission_classes = [IsAdminPrin]

    def get_serializer_class(self):
        if self.action == 'list':
            return CallAdminListSerializer

        return CallAdminGeneralSerializer

    def get_queryset(self):
        return super().get_queryset().order_by('-fecha_publicacion')

    def destroy(self, request, *args, **kwargs):
        call = self.get_object()
        if call.pdf:
            pdf = call.pdf
            ruta = pdf.ruta
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta,
            )
            call.pdf = None
            call.save()
            pdf.delete()
        return super().destroy(request, *args, **kwargs)