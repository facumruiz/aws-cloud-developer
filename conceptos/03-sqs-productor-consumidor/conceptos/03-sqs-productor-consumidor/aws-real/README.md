# 03 (AWS real) - Cola SQS real con productor y consumidor

## Objetivo

Crear una cola SQS de verdad, una Lambda que le manda mensajes (productor) y otra que se dispara sola cuando llegan mensajes (consumidor) — y comprobar en carne propia que un mensaje no se pierde aunque el consumidor falle. 100% Free Tier.

## Paso 1: Crear la cola SQS

1. Consola de AWS → buscar **SQS**
2. **Create queue**
3. Tipo: **Standard** (dejar por defecto)
4. Nombre: `pedidos-queue`
5. Dejar el resto por defecto → **Create queue**
6. Copiar la **URL de la cola** (aparece en los detalles, tipo `https://sqs.us-east-1.amazonaws.com/.../pedidos-queue`) — se necesita en el paso 3

## Paso 2: Crear la Lambda consumidora primero

Se crea primero el consumidor para poder conectarle el trigger de la cola apenas se crea.

1. Lambda → **Create function** → Author from scratch
2. Nombre: `pedidos-consumidor`
3. Runtime: Node.js 20.x → **Create function**
4. Pegar el contenido de `consumidor.js` de esta carpeta en el editor → **Deploy**

### Darle permiso para leer de la cola

1. Pestaña **Configuration** → **Permissions**
2. Click en el nombre del rol de ejecución (abre IAM en otra pestaña)
3. **Add permissions → Attach policies**
4. Buscar y adjuntar: **AWSLambdaSQSQueueExecutionRole**
   > Esta es la política administrada estándar de AWS para que una Lambda pueda leer y borrar mensajes de una cola SQS.

### Conectar la cola como trigger

1. Volver a la Lambda `pedidos-consumidor` → pestaña **Configuration → Triggers → Add trigger**
2. Seleccionar **SQS**
3. Elegir la cola `pedidos-queue`
4. **Add**

Con esto, cada vez que llegue un mensaje a la cola, AWS invoca esta Lambda automáticamente — nadie más la llama.

## Paso 3: Crear la Lambda productora

1. Lambda → **Create function** → Author from scratch
2. Nombre: `pedidos-productor`
3. Runtime: Node.js 20.x → **Create function**
4. Pegar el contenido de `productor.js` de esta carpeta → **Deploy**

### Instalar la dependencia del SDK de SQS

El código usa `@aws-sdk/client-sqs`. La consola de Lambda no tiene `npm install` integrado para pegar código suelto, así que hay dos opciones:

**Opción simple (recomendada acá)**: el runtime Node.js 20.x de Lambda **ya incluye el AWS SDK v3 preinstalado** como parte del entorno de ejecución — no hace falta subir `node_modules`. Si al invocar tira un error de "Cannot find module", avisar y se resuelve empaquetando el zip con la dependencia (como en el proyecto 2 con Terraform).

### Configurar la variable de entorno QUEUE_URL

1. Pestaña **Configuration → Environment variables → Edit**
2. Agregar: `QUEUE_URL` = la URL de la cola que copiaste en el Paso 1
3. **Save**

### Darle permiso para mandar mensajes a la cola

1. Configuration → Permissions → click en el rol de ejecución
2. Add permissions → Attach policies
3. Buscar y adjuntar: **AmazonSQSFullAccess**
   > En un trabajo real se restringiría a `sqs:SendMessage` sobre esa cola puntual, pero para simplificar mientras se aprende se usa la política completa.

## Paso 4: Probar de punta a punta

1. En `pedidos-productor` → pestaña **Test** → crear un test event:
```json
   { "orderId": 1, "item": "Teclado" }
```
2. **Test** → debería responder `202` con el mensaje "Pedido recibido, procesando..."
3. Ir a `pedidos-consumidor` → **Monitor → View CloudWatch logs**
4. En unos segundos (sin que nadie invoque nada a mano) debería aparecer un log nuevo: `Procesando pedido 1 (Teclado)...` / `Pedido 1 procesado.`

**Esto es la prueba real del patrón**: nadie llamó directamente al consumidor — se disparó solo porque había un mensaje en la cola.

## Paso 5: El experimento importante — comprobar que el mensaje no se pierde

1. En `pedidos-consumidor`, modificar el código para que **falle a propósito**:
```js
   exports.handler = async (event) => {
     throw new Error("Fallo simulado a propósito");
   };
```
2. **Deploy**
3. Volver a `pedidos-productor` y correr el test event de nuevo (`Test`)
4. Ir a CloudWatch logs de `pedidos-consumidor` — va a aparecer el error, **varias veces** (SQS reintenta automáticamente cuando el consumidor falla)

**Esto demuestra en la práctica lo que se charló en el módulo Node puro**: como el consumidor nunca confirma que procesó el mensaje (porque tira una excepción), SQS entiende que no se completó y lo vuelve a entregar. El mensaje no se pierde — se reintenta.

5. Restaurar el código original de `consumidor.js` y volver a hacer **Deploy** para dejarlo funcionando normal.

## Ver la cola desde la consola

SQS → `pedidos-queue` → **Send and receive messages** — ahí se puede ver manualmente si hay mensajes esperando (útil para debuggear si el consumidor no está procesando).

## Limpiar (para no dejar recursos sin usar)

- Lambda → borrar `pedidos-productor` y `pedidos-consumidor`
- SQS → borrar `pedidos-queue`
