# 01 (AWS real) - Crear tu primera Lambda en la consola

## Objetivo

Crear una función Lambda real (no simulada) desde la consola de AWS, invocarla varias veces, y comprobar algo que sorprende a mucha gente: **la memoria de una Lambda no es confiable entre invocaciones**. Esto es 100% gratis (Free Tier).

## Paso 1: Crear la función

1. Entrá a la consola de AWS → buscá **Lambda**
2. **Create function** (Crear función)
3. Elegí **Author from scratch** (Crear desde cero)
4. Nombre de la función: `lambda-basics-demo`
5. Runtime: **Node.js 20.x**
6. Arquitectura: dejá la que viene por defecto (x86_64)
7. **Create function**

## Paso 2: Pegar el código

1. En la pestaña **Code** (Código), vas a ver un editor con un `index.js` de ejemplo
2. Borrá todo y pegá el contenido de `index.js` de esta carpeta
3. Click en **Deploy** (Implementar) — este botón sube tu código a la Lambda real

## Paso 3: Crear un "Test event" para crear una tarea

1. Pestaña **Test**
2. **Create new test event**
3. Nombre del evento: `crear-tarea-1`
4. En el JSON, pegá:
   ```json
   { "action": "create", "title": "Aprender AWS real" }
   ```
5. **Save**, después **Test**

Deberías ver en el resultado algo como:
```json
{ "statusCode": 201, "body": "{\"id\":1,\"title\":\"Aprender AWS real\",\"done\":false}" }
```

## Paso 4: Crear otra tarea y después listar

1. Editá el test event (o creá uno nuevo) con:
   ```json
   { "action": "create", "title": "Segunda tarea" }
   ```
2. **Test** de nuevo
3. Ahora creá un tercer test event:
   ```json
   { "action": "list" }
   ```
4. **Test** — deberías ver las 2 tareas juntas en la respuesta

**Esto funciona porque, mientras la Lambda sigue "caliente" (el mismo contenedor sigue vivo entre invocaciones), la variable `tasks` en memoria persiste.**

## Paso 5: El experimento importante (por qué NO hay que confiar en esto)

1. Andá a **Configuration → General configuration → Edit**
2. Cambiá la memoria de 128 MB a 256 MB (cualquier cambio de configuración fuerza que la próxima invocación use un contenedor nuevo)
3. **Save**
4. Volvé a **Test** con el test event de `list`

**Resultado esperado: la lista vuelve a estar vacía.** El cambio de configuración obligó a AWS a levantar un contenedor nuevo, y la variable `tasks` (que vivía en memoria del contenedor anterior) se perdió.

## La lección real (para la entrevista)

> **Una Lambda puede "recordar" cosas en memoria mientras el contenedor sigue caliente, pero nunca hay que diseñar pensando en eso — AWS puede reciclar el contenedor en cualquier momento (por inactividad, por escalado, por un deploy). Por eso el estado real siempre va en un servicio externo persistente (DynamoDB, S3, etc.), nunca en variables de la Lambda.**

Esto conecta directo con el Proyecto 2 (CRUD con DynamoDB) que ya hiciste: ahí el estado vive en DynamoDB, no en la Lambda, así que sobrevive sin importar cuántas veces se recicle el contenedor.

## Ver los logs (CloudWatch)

Pestaña **Monitor → View CloudWatch logs**. Ahí vas a ver cada invocación registrada, con la duración, memoria usada, y cualquier `console.log` que hubieras agregado al código. Esto es lo que en un trabajo real se revisa para debuggear una Lambda en producción.

## Limpiar (para no dejar nada corriendo sin usar)

Lambda no cobra por estar "creada" sin invocarse, así que no es obligatorio borrarla, pero si querés dejar todo prolijo: **Actions → Delete function**.
