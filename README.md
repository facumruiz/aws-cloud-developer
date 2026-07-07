# AWS Portfolio — Preparación para entrevista (Node.js / Cloud Dev)

Repo de estudio y portfolio práctico de AWS, armado con Node.js, sin certificación como objetivo — el foco es experiencia demostrable y criterio real para una entrevista técnica.

## 📋 Plan de estudio

Ver [`PLAN.md`](./PLAN.md): objetivo, checkpoint de estado actual, info sobre practicar gratis (Free account plan de AWS), y roadmap de ambas líneas de trabajo.

## Estructura del repo

```
├── PLAN.md              → plan de estudio, estado y roadmap
├── conceptos/           → conceptos de AWS en Node puro (sin infraestructura) + guías para AWS real
└── proyectos/           → proyectos con infraestructura como código (Terraform), LocalStack y AWS real
```

## 🧠 `conceptos/` — entender la lógica antes que la configuración

Cada módulo es un concepto independiente que corre con `node app.js`, sin Docker ni cuenta de AWS. Los módulos marcados con `aws-real/` además tienen una guía paso a paso para repetir el mismo concepto en la consola real de AWS.

| # | Módulo | Concepto |
|---|---|---|
| 00 | [seguridad-cuenta-real](./conceptos/00-seguridad-cuenta-real) | Billing Alarm (con capturas) — antes de tocar la cuenta real |
| 01 | [lambda-basics](./conceptos/01-lambda-basics) | Patrón handler de Lambda + CRUD básico (+ guía AWS real) |
| 02 | [async-errores](./conceptos/02-async-errores) | Manejo de errores en código asíncrono |
| 03 | [sqs-productor-consumidor](./conceptos/03-sqs-productor-consumidor) | Colas: desacoplar productor y consumidor |
| 04 | [eventos-triggers](./conceptos/04-eventos-triggers) | Arquitectura event-driven (S3 → Lambda) |
| 05 | [idempotencia-reintentos](./conceptos/05-idempotencia-reintentos) | Evitar duplicados en sistemas distribuidos |
| 06 | [config-variables-entorno](./conceptos/06-config-variables-entorno) | Separar código de configuración |
| 07 | [teoria-entrevista](./conceptos/07-teoria-entrevista) | Cold starts, límites, DynamoDB vs SQL (sin código) |

Ver [`conceptos/README.md`](./conceptos/README.md) para el detalle completo.

## 🏗️ `proyectos/` — infraestructura como código

Proyectos completos con Terraform, pensados para correr contra LocalStack (gratis, sin cuenta) y luego contra la cuenta real de AWS.

| # | Proyecto | Servicios |
|---|---|---|
| 1 | [s3-static-site](./proyectos/01-s3-static-site) | S3 + Lambda + API Gateway |
| 2 | [serverless-crud-api](./proyectos/02-serverless-crud-api) | API Gateway + 5 Lambdas + DynamoDB |

Ver [`proyectos/README.md`](./proyectos/README.md) para el detalle completo.

## Stack general

Node.js 20, AWS SDK v3, Terraform, Docker + LocalStack, AWS Free account plan (créditos, cuenta real).
