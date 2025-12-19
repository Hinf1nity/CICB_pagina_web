import boto3
from django.conf import settings

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.AWS_S3_INTERNAL_ENDPOINT,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_DEFAULT_REGION,
)
