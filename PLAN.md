# Plan de estudio AWS — Preparación para entrevista (Node.js / Dev Cloud)

## Objetivo

Conseguir laburo como Cloud Developer / dev con AWS, con experiencia práctica demostrable (proyectos propios + repo de conceptos), sin gastar dinero, y entendiendo la lógica detrás de cada servicio (no solo "cómo clickear").

## Situación actual (checkpoint)

- ✅ Cuenta real de AWS creada y funcionando (acceso a consola confirmado)
- ✅ Confirmado: cuenta en **"Free account plan"** — $100 en créditos, sin cobro directo mientras dure el plan (vence al agotar los créditos o al llegar a la fecha límite del plan, lo que ocurra primero)
- ✅ Billing Alarm configurada (avisa por mail si el gasto estimado supera $1 USD) — ver [`conceptos/00-seguridad-cuenta-real/README.md`](./conceptos/00-seguridad-cuenta-real/README.md)
- ✅ Carpeta de proyectos con infraestructura real: [`proyectos/`](./proyectos) (LocalStack + Terraform + Node.js)
  - Proyecto 1: sitio estático S3 + API Lambda — funcionando
  - Proyecto 2: CRUD API (API Gateway + Lambda + DynamoDB) — funcionando
- ✅ Carpeta de conceptos sin infraestructura: [`conceptos/`](./conceptos) (Node puro, `node app.js`)
  - Módulo 1: patrón Lambda + CRUD — completo
  - Módulo 2: async y manejo de errores — completo
  - En curso: Módulo 3 (colas SQS)

## ¿Se puede practicar gratis en la cuenta real?

**Sí — y con una ventaja extra que no sabíamos al principio.**

La cuenta quedó activada bajo el **"Free account plan"** de AWS (el modelo actual, con créditos, distinto al Free Tier clásico de 12 meses):

- USD $100 de crédito inicial (+ hasta $100 más completando actividades)
- **Mientras se esté en este plan, no se cobra nada** — el uso descuenta créditos, no la tarjeta
- El plan vence al agotarse los créditos o al llegar a la fecha límite del plan (lo que ocurra primero)
- Si se agotan los créditos o vence el plazo, la cuenta se **cierra automáticamente** (no hay cobro sorpresa; hay 90 días de gracia para pasar a plan pago si se quisiera mantener el acceso)
- Acceso a más de 30 servicios "Always Free" con límites de uso mensuales

Esto es más seguro que el escenario que se planteó al principio: el riesgo real no es "un cobro inesperado en la tarjeta", sino simplemente gastar créditos de más rápido de lo esperado. La Billing Alarm (módulo 00) sigue siendo útil para tener visibilidad, pero el margen de error es mucho mayor.

### Servicios "always free" (gratis para siempre, sin límite de tiempo, cualquier cuenta)
Estos son los que vamos a usar en el curso, y su límite gratuito es generoso para practicar:

| Servicio | Límite gratis mensual |
|---|---|
| Lambda | 1,000,000 invocaciones + 400,000 GB-segundos de cómputo |
| DynamoDB | 25 GB de almacenamiento + 25 unidades de lectura/escritura provisionadas |
| S3 | 5 GB de almacenamiento estándar |
| SQS | 1,000,000 de solicitudes |
| SNS | 1,000,000 de publicaciones |
| API Gateway | 1,000,000 de llamadas (solo primeros 12 meses, después es pago por uso muy bajo) |

Para practicar (crear, probar, borrar) no se acerca ni de cerca a estos límites.

### Lo que SÍ cuesta (evitar mientras se practica)
- **NAT Gateway**: no tiene free tier, cobra por hora siempre. No lo necesitamos para estos proyectos.
- **EC2** fuera de los 750 hs/mes del primer año, o de un tamaño no cubierto.
- Dejar recursos corriendo sin usar por mucho tiempo (buena práctica: destruir con Terraform/consola al terminar cada sesión de práctica).

### La red de seguridad ya está puesta
Con la Billing Alarm configurada, cualquier gasto que se escape de lo esperado avisa por mail antes de que sea un problema real.

## Estructura de aprendizaje (dos vías en paralelo)

### Vía A — Conceptos (carpeta `conceptos/`)
Node puro, sin infraestructura, para entender la LÓGICA antes que la configuración. Ideal para explicar en la entrevista con criterio, no solo de memoria.

| # | Módulo | Estado |
|---|---|---|
| 00 | Seguridad de cuenta real (Billing Alarm) | ✅ Hecho |
| 01 | Patrón Lambda + CRUD básico | ✅ Hecho |
| 02 | Async y manejo de errores | ✅ Hecho |
| 03 | Colas (SQS): productor/consumidor | 🔵 En curso |
| 04 | Eventos y triggers (S3 → Lambda) | ⬜ Pendiente |
| 05 | Idempotencia y reintentos | ⬜ Pendiente |
| 06 | Configuración y variables de entorno | ⬜ Pendiente |
| 07 | Teoría de entrevista (cold starts, límites, DynamoDB vs SQL) | ⬜ Pendiente |

### Vía B — Proyectos con infraestructura real (carpeta `proyectos/`)
Terraform + LocalStack (simulado) y, una vez firme, los mismos proyectos desplegados en la cuenta real de AWS (Free Tier) para tener el link real andando.

| # | Proyecto | Estado |
|---|---|---|
| 1 | Sitio estático (S3) + API (Lambda + API Gateway) | ⬜ Pendiente |
| 2 | CRUD API (API Gateway + Lambda + DynamoDB) | ⬜ Pendiente |
| 3 | Procesador asíncrono (SQS + Lambda + DynamoDB) | ⬜ Pendiente |
| 4 | Pipeline de imágenes (trigger S3 + Lambda) | ⬜ Pendiente |
| 5 | Notificaciones event-driven (DynamoDB Streams + SNS/SQS) | ⬜ Pendiente |
| — | Migrar 1-2 proyectos a la cuenta real de AWS (no solo LocalStack) | ⬜ Pendiente |

## Recursos externos

- [AWS Skill Builder — cursos gratis para Developer](https://skillbuilder.aws/category/role/developer?page=1&accessTier=free): cursos oficiales gratuitos de AWS filtrados por rol "Developer". No consume créditos de la cuenta (plataforma separada).
- [AWS Skill Builder — ruta DevOps Engineer](https://skillbuilder.aws/category/role/dev-ops-engineer): cursos filtrados por el rol DevOps Engineer.
