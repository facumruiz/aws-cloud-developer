# 01 - Patrón básico de Lambda (CRUD)

## Concepto

Una Lambda es una función que recibe un `event` y devuelve una respuesta. Si está detrás de API Gateway, ese `event` trae la info del request HTTP (`body`, `pathParameters`, `queryStringParameters`), y la respuesta tiene que tener la forma `{ statusCode, body }` (con `body` siempre como **string**, no como objeto).

## Por qué importa en la entrevista

Es la base de todo lo demás. Si entendés bien esto, entendés el 80% de cómo se arma una API serverless.

## Correr

```bash
node app.js
```

## Para practicar

- Agregá un campo `priority` a las tareas
- Hacé que `createTask` rechace títulos de más de 100 caracteres
- Pensá: ¿qué pasa si dos requests llegan al mismo tiempo? (esto lo vemos más a fondo en el módulo 05)

## Documentación oficial

- [¿Qué es AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Lambda: el handler en Node.js](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
