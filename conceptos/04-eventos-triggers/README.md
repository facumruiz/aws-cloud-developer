# 04 - Eventos y triggers (event-driven)

## Concepto

Una Lambda no siempre se invoca por un request HTTP. Puede dispararse automáticamente por un **evento**: se subió un archivo a S3, se insertó un registro en DynamoDB, llegó un mensaje a una cola. El evento describe **qué pasó y dónde**, no necesariamente trae todo el contenido.

## Por qué importa en la entrevista

"Event-driven architecture" es una palabra clave que se repite mucho. Entender que una Lambda puede reaccionar a algo (no solo responder a un pedido directo) es la base de pipelines de procesamiento de datos, notificaciones, y automatización.

## Correr

```bash
node app.js
```

## Para practicar

- Agregá un segundo listener al bucket (por ejemplo, uno que solo registre un log de auditoría de todo lo que se sube, sin importar el tipo)
- Pensá: ¿qué pasa si DOS Lambdas distintas necesitan reaccionar al mismo evento? (en AWS real, esto se resuelve con **SNS** — un servicio que distribuye una notificación a múltiples suscriptores)

## Documentación oficial

- [S3: notificaciones de eventos](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html)
- [Usar Lambda con Amazon S3](https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html)
- [Amazon SNS - guía del desarrollador](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
