#!/bin/bash
set -e

echo "1) Levantando LocalStack..."
docker compose up -d

echo "2) Esperando a que LocalStack esté listo..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"s3": "available"'; do
  sleep 2
done

echo "3) Aplicando Terraform (tflocal)..."
cd terraform
tflocal init
tflocal apply -auto-approve

API_ID=$(tflocal output -raw api_url | grep -oP '(?<=restapis/)[^/]+')
cd ..

echo "4) Subiendo frontend a S3..."
awslocal s3 cp frontend/index.html s3://portfolio-static-site/index.html

echo ""
echo "Listo. URLs:"
echo "  Sitio:  http://localhost:4566/portfolio-static-site/index.html"
echo "  API:    http://localhost:4566/restapis/${API_ID}/local/_user_request_/hello"
