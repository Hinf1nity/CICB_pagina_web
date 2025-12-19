#!/bin/bash
set -e

echo "🔐 Setting CORS on bucket ${AWS_STORAGE_BUCKET_NAME}"

awslocal s3api put-bucket-cors \
  --bucket ${AWS_STORAGE_BUCKET_NAME} \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedOrigins": ["http://localhost:5173"],
        "AllowedMethods": ["PUT", "GET", "HEAD"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'

echo "✅ CORS configured"
