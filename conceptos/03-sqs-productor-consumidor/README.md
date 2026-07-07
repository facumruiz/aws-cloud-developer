# 03 - Colas (SQS): patrón productor/consumidor

## Concepto

Separar "recibir el pedido" de "procesarlo", conectados por una cola. El productor responde rápido al cliente; el consumidor procesa en su propio tiempo, y si falla, el mensaje no se pierde (queda en la cola para reintentar).

## Por qué importa en la entrevista

Es el ejemplo clásico de **arquitectura desacoplada**. Te van a preguntar "¿por qué usarías una cola acá?" — la respuesta siempre gira en torno a: resiliencia (no perder trabajo si algo falla), no bloquear al cliente esperando un proceso lento, y poder escalar productor y consumidor por separado.

## Correr

```bash
node app.js
```

## Para practicar

- Agregá que el consumidor falle aleatoriamente (como en el módulo 02) y que el mensaje **vuelva a la cola** si falla, en vez de perderse
- Pensá: si un mensaje falla 5 veces seguidas, ¿debería reintentarse para siempre? (esto es lo que en AWS real se resuelve con una **Dead Letter Queue** — una cola aparte donde van los mensajes que fallaron demasiadas veces, para revisarlos a mano)
