# AWS + Node.js Portfolio (práctica local con LocalStack)

Proyectos de práctica de arquitecturas AWS, corriendo 100% local con Docker + LocalStack + Terraform. Sin cuenta AWS real.

## Proyectos

1. **[01-s3-static-site](./01-s3-static-site)** — Sitio estático (S3) + API serverless (Lambda + API Gateway)
2. **[02-serverless-crud-api](./02-serverless-crud-api)** — CRUD API (API Gateway + Lambda + DynamoDB)
3. 03-async-order-processor — Procesamiento asíncrono (SQS + Lambda + DynamoDB)
4. 04-image-processing-pipeline — Triggers S3 + Lambda
5. 05-event-driven-notifications — DynamoDB Streams + SNS/SQS

## Stack común

Docker, LocalStack, Terraform (+ tflocal), Node.js 20, AWS SDK v3, AWS CLI (+ awslocal)
