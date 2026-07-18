# 05 - Idempotencia y reintentos

## Concepto

En sistemas distribuidos, un mismo pedido puede llegar duplicado (el cliente reintenta porque no supo si la primera vez funcionó). Una operación **idempotente** da el mismo resultado sin importar cuántas veces se ejecute con la misma clave.

## Por qué importa en la entrevista

Se pregunta mucho en el contexto de pagos, colas (un mensaje de SQS puede entregarse más de una vez — "at-least-once delivery" es la garantía real de SQS, no "exactly-once"), y APIs en general. Mostrar que pensás en duplicados es señal de experiencia real.

## Correr

```bash
node app.js
```

## Para practicar

- Conectá esto con el módulo 03 (colas): agregá una `idempotencyKey` a los mensajes de la cola y hacé que el consumidor ignore mensajes ya procesados
- Pensá: ¿dónde guardarías las claves ya procesadas en un sistema real, y por cuánto tiempo? (en AWS real, normalmente se usa DynamoDB con un TTL)

## Documentación oficial

- [Lambda: reintentos e invocación](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [SQS: colas estándar (entrega "at-least-once")](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html)
- [DynamoDB: expresiones de condición](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
