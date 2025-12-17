#!/bin/bash
set -e

echo "🪣 Creating S3 bucket in LocalStack..."

awslocal s3 mb s3://mi-bucket || true

echo "✅ Bucket mi-bucket ready"
