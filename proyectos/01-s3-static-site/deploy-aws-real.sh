#!/bin/bash
set -e

echo "1) Aplicando Terraform contra AWS real (cuenta: $(aws sts get-caller-identity --query Account --output text))..."
cd terraform-aws-real
terraform init
terraform apply -auto-approve

API_URL=$(terraform output -raw api_url)
BUCKET_NAME=$(terraform output -raw bucket_name)
SITE_URL=$(terraform output -raw bucket_website_url)
cd ..

echo ""
echo "2) Subiendo frontend a S3 (bucket real: $BUCKET_NAME)..."
aws s3 cp frontend/index.html "s3://$BUCKET_NAME/index.html"

echo ""
echo "Listo. URLs reales:"
echo "  Sitio: $SITE_URL"
echo "  API:   $API_URL"
echo ""
echo "IMPORTANTE: actualizá frontend/index.html con la URL de la API de arriba"
echo "y volvé a subirlo con:"
echo "  aws s3 cp frontend/index.html s3://$BUCKET_NAME/index.html"
