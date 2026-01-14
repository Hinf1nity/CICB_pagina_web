from rest_framework import serializers
from .models import PDF
from django.conf import settings
from utils.s3 import s3_client


class PDFSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PDF
        fields = ['id', 'url']

    def get_url(self, obj):
        if not obj:
            return None

        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": obj.ruta,
            },
            ExpiresIn=60 * 60 * 6,  # 6 horas
        )
        # presigned_url = presigned_url.replace(
        #     settings.AWS_S3_INTERNAL_ENDPOINT,
        #     settings.AWS_S3_EXTERNAL_ENDPOINT,
        # )
        return presigned_url
