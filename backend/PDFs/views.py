from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.conf import settings
from .models import PDF
from .serializers import PDFSerializer
from utils.s3 import s3_client
import uuid
from users.permissions import IsAdminPrin


class PDFViewSet(viewsets.GenericViewSet):
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer

    @action(detail=False, methods=["post"], url_path="pdf-presigned-url", permission_classes=[IsAdminPrin])
    def generate_pdf_presigned_url(self, request):
        file_name = request.data.get("file_name")
        content_type = request.data.get("content_type")

        if not file_name or not content_type:
            return Response(
                {"error": "file_name y content_type son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if content_type != "application/pdf":
            return Response(
                {"error": "Solo se permiten archivos PDF"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not file_name.lower().endswith(".pdf"):
            return Response(
                {"error": "El archivo debe tener extensión .pdf"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ruta = f"pdfs/{uuid.uuid4()}.pdf"

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": ruta,
                "ContentType": "application/pdf",
            },
            ExpiresIn=300,
        )

        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )

        pdf = PDF.objects.create(
            ruta=ruta,
        )

        return Response(
            {
                "upload_url": presigned_url,
                "pdf_id": pdf.id,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["patch"], url_path="pdf-presigned-update", permission_classes=[IsAdminPrin])
    def update_pdf_presigned(self, request, pk=None):
        file = self.get_object()

        if not file.ruta:
            return Response(
                {"error": "Este archivo no esta guardado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        content_type = request.data.get("content_type")

        if content_type != "application/pdf":
            return Response(
                {"error": "Solo se permiten PDFs"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ruta = file.ruta

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": ruta,
                "ContentType": "application/pdf",
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

    @action(detail=True, methods=["delete"], url_path="pdf-delete", permission_classes=[IsAdminPrin])
    def delete_pdf_s3(self, request, pk=None):
        # 1. Obtenemos la instancia del modelo PDF
        file_instance = self.get_object()

        # 2. Verificamos si existe la ruta
        if not file_instance.ruta:
            return Response(
                {"error": "Este archivo no tiene una ruta asociada en S3"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ruta_s3 = file_instance.ruta

        try:
            # 3. Eliminar el archivo del bucket de S3
            s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=ruta_s3,
            )

            # 4. Eliminar el registro del modelo PDF
            # Esto automáticamente pondrá en NULL el campo 'pdf' en el modelo 'News'
            # gracias a 'null=True, blank=True' en la ForeignKey de News.
            file_instance.delete()

            return Response(
                {"message": f"Archivo {ruta_s3} eliminado exitosamente de S3 y base de datos."},
                status=status.HTTP_204_NO_CONTENT,
            )

        except Exception as e:
            return Response(
                {"error": f"Error al eliminar de S3: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
