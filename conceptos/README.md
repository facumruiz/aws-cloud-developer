# AWS Conceptos - De Node.js puro a servicios reales de AWS

Ejercicios para entender los conceptos clave de AWS/serverless que se preguntan en entrevistas. Arrancan en **Node puro** (sin Docker, sin Terraform, sin cuentas) para enfocarse en la lógica, y una vez que el patrón está sólido, se repiten **contra servicios reales de AWS** (Free Tier, con la Billing Alarm del módulo 00 como red de seguridad).

## Cómo usar este repo

Cada carpeta de módulo tiene dos partes:

- **`app.js` + `README.md`** (raíz de la carpeta): la versión en Node puro, corré con `node app.js`
- **`aws-real/README.md`** (cuando existe): la guía paso a paso para hacer lo mismo, pero en la consola real de AWS

## Estado

| # | Carpeta | Concepto | Node puro | En AWS real |
|---|---|---|---|---|
| 00 | [seguridad-cuenta-real](./00-seguridad-cuenta-real) | Billing Alarm (con capturas) | — | ✅ Hecho |
| 00b | [usuario-iam-despliegues](./00b-usuario-iam-despliegues) | Usuario IAM (dev-terraform) para Terraform/CLI, sin usar la cuenta root | — | ✅ Hecho |
| 01 | [lambda-basics](./01-lambda-basics) | Patrón handler de Lambda + CRUD básico | ✅ Hecho | 🔵 En curso |
| 02 | [async-errores](./02-async-errores) | Manejo de errores en código asíncrono | ✅ Hecho | ⬜ Pendiente |
| 03 | [sqs-productor-consumidor](./03-sqs-productor-consumidor) | Colas: desacoplar productor y consumidor | ⬜ Pendiente | ⬜ Pendiente |
| 04 | [eventos-triggers](./04-eventos-triggers) | Arquitectura event-driven (S3 → Lambda) | ⬜ Pendiente | ⬜ Pendiente |
| 05 | [idempotencia-reintentos](./05-idempotencia-reintentos) | Evitar duplicados en sistemas distribuidos | ⬜ Pendiente | ⬜ Pendiente |
| 06 | [config-variables-entorno](./06-config-variables-entorno) | Separar código de configuración | ⬜ Pendiente | ⬜ Pendiente |
| 07 | [teoria-entrevista](./07-teoria-entrevista) | Cold starts, memoria/timeout, límites, DynamoDB vs SQL (sin código) | ⬜ Lectura | — |

## Por qué las dos vías

- **Node puro**: entender el "por qué" sin pelear con infraestructura — ya lo hicimos para 01 y 02
- **AWS real**: tocar la consola de verdad (crear una Lambda, verla en CloudWatch, invocarla) — esto es lo que da experiencia concreta para mostrar/hablar en la entrevista

## Orden sugerido

Ir módulo por módulo: primero la versión Node puro, y una vez que el concepto está claro, repetirlo en `aws-real/`. El módulo 07 es lectura y se puede hacer en cualquier momento.

