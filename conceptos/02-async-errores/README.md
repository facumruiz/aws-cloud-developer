# 02 - Async y manejo de errores

## Concepto

Toda llamada a un servicio de AWS (DynamoDB, S3, SQS...) desde una Lambda es asíncrona y **puede fallar** (throttling, timeout de red, permisos). Si no se envuelve en `try/catch`, la Lambda termina en error sin devolver una respuesta HTTP prolija — el cliente ve un 502 genérico sin explicación.

## Por qué importa en la entrevista

Preguntan mucho "¿qué pasa si X falla?" — mostrar que pensás en el camino de error, no solo en el caso feliz, es lo que diferencia a alguien junior de alguien con criterio.

## Correr

```bash
node app.js
```

Corré varias veces: como el fallo es aleatorio (40% de probabilidad), vas a ver tanto casos OK como casos de error, y la diferencia entre el handler que lo maneja bien y el que no.

## Para practicar

- Agregá un tercer handler que reintente automáticamente 1 vez si falla antes de devolver error
- Pensá: ¿por qué no conviene reintentar infinitas veces? (pista: esto se conecta con el módulo 05, idempotencia)

## Documentación oficial

- [Lambda: reintentos e invocación](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Lambda: manejo de excepciones en Node.js](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-exceptions.html)
