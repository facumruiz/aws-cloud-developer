#!/bin/bash
set -e

echo "1) Instalando dependencias de Node..."
npm install --omit=dev --prefix .

echo "2) Levantando LocalStack..."
docker compose up -d

echo "3) Esperando a que LocalStack esté listo..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"dynamodb": "available"'; do
  sleep 2
done

echo "4) Empaquetando las Lambdas (src/ + node_modules)..."
mkdir -p build
rm -f build/lambda.zip
zip -rq build/lambda.zip src node_modules

echo "5) Aplicando Terraform (tflocal)..."
cd terraform
tflocal init
tflocal apply -auto-approve
API_URL=$(tflocal output -raw api_base_url)
cd ..

echo ""
echo "Listo. Base de la API:"
echo "  $API_URL"
echo ""
echo "Probar con:"
echo "  curl -X POST $API_URL -d '{\"title\":\"Aprender DynamoDB\"}'"
echo "  curl $API_URL"
