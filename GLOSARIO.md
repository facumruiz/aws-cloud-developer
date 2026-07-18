# Glosario técnico — AWS / Serverless / Node.js

Resumen de vocabulario y conceptos vistos en el curso, para repasar rápido antes de una entrevista. Organizado por categoría.

---

## Compute / Serverless

**Serverless**: modelo donde no gestionás servidores directamente — el proveedor (AWS) se encarga de aprovisionar, escalar y mantener la infraestructura. Se paga por uso, no por tener algo "prendido".

**Lambda**: servicio de cómputo serverless de AWS. Corre código (una función) en respuesta a eventos, sin que haya un servidor corriendo todo el tiempo.

**Handler**: la función que AWS invoca cuando se dispara una Lambda. Recibe un `event` y devuelve una respuesta (o no devuelve nada si no está detrás de algo que espera respuesta HTTP).

**Event**: el objeto que le llega al handler con la información del disparador (un request HTTP, un mensaje de una cola, un archivo subido a S3, etc.). Su forma cambia según qué disparó la Lambda.

**Cold start**: la demora extra que ocurre cuando AWS tiene que levantar un contenedor nuevo para una Lambda que no se usó hace rato (carga el runtime, inicializa el código). Una invocación con el contenedor ya "caliente" es más rápida.

**Runtime**: el entorno de ejecución del lenguaje (ej: Node.js 20.x) que usa la Lambda para correr el código.

**Timeout**: tiempo máximo que una Lambda puede tardar en ejecutarse antes de que AWS la corte (máximo 15 minutos).

**Memoria (Lambda)**: se configura entre 128 MB y 10 GB. Aumentar la memoria también aumenta la CPU asignada proporcionalmente — a veces subir memoria hace que la función corra más rápido y salga más barata en total.

**Event-driven architecture**: arquitectura donde el código reacciona a que algo pasó (un evento), en vez de ser invocado directamente por un cliente.

---

## HTTP / API

**API Gateway**: servicio de AWS que expone endpoints HTTP y los conecta con Lambda (u otros servicios).

**AWS_PROXY (integración proxy)**: modo de integración entre API Gateway y Lambda donde la Lambda recibe el request HTTP completo y debe devolver la respuesta completa (`statusCode`, `headers`, `body`). Es el patrón estándar para APIs serverless.

**CORS**: mecanismo del navegador que controla si un sitio puede hacer requests a un dominio distinto. Se maneja con el header `Access-Control-Allow-Origin`.

**Códigos de estado HTTP usados en el curso**:
- `200 OK`: la operación se completó bien.
- `201 Created`: se creó un recurso nuevo.
- `202 Accepted`: el pedido se aceptó, pero **todavía no se procesó** (típico en patrones con cola).
- `204 No Content`: la operación se completó bien, sin contenido para devolver (ej: un DELETE).
- `400 Bad Request`: el pedido está mal formado (dato inválido).
- `404 Not Found`: el recurso pedido no existe.
- `500 Internal Server Error`: algo falló del lado del servidor.

---

## Almacenamiento y datos

**S3 (Simple Storage Service)**: almacenamiento de objetos (archivos). Se puede usar para hosting de sitios estáticos.

**Bucket**: el "contenedor" donde se guardan los archivos en S3. Su nombre debe ser único en toda AWS, no solo en la cuenta.

**DynamoDB**: base de datos NoSQL (clave-valor / documentos) totalmente gestionada por AWS.

**NoSQL vs SQL**: DynamoDB (NoSQL) conviene cuando se conoce de antemano el patrón de acceso a los datos y se necesita escalar sin gestionar infraestructura; SQL (RDS) conviene cuando se necesitan consultas complejas con joins que no se anticiparon.

**PAY_PER_REQUEST**: modo de facturación de DynamoDB donde no hay que provisionar capacidad de antemano — se paga por lo que se usa. Ideal para cargas nuevas o impredecibles.

**Partition key**: el atributo que DynamoDB usa para distribuir y encontrar los datos (equivalente a una clave primaria simple).

---

## Mensajería / desacoplamiento

**SQS (Simple Queue Service)**: servicio de colas de mensajes de AWS.

**Productor / Consumidor**: patrón donde un componente (productor) encola un trabajo y responde rápido, y otro componente (consumidor) lo procesa de forma independiente, a su propio ritmo.

**Visibility timeout**: tiempo durante el cual un mensaje de SQS que está siendo procesado queda "invisible" para otros consumidores. Si el consumidor no confirma que terminó (o falla) antes de que venza ese tiempo, el mensaje vuelve a estar disponible para reintentarse.

**At-least-once delivery**: garantía que da SQS (colas estándar): un mensaje se entrega **al menos una vez**, pero puede entregarse más de una vez (por eso importa la idempotencia).

**Dead Letter Queue (DLQ)**: una cola aparte donde van los mensajes que fallaron demasiadas veces, para revisarlos manualmente en vez de reintentarlos para siempre.

**SNS (Simple Notification Service)**: servicio de notificaciones pub/sub — distribuye un mensaje a múltiples suscriptores (colas, emails, etc.) a la vez.

**Trigger**: la configuración que conecta un servicio (S3, SQS, DynamoDB Streams) con una Lambda para que se dispare automáticamente.

---

## Seguridad / IAM

**IAM (Identity and Access Management)**: servicio de AWS para gestionar usuarios, roles y permisos.

**Cuenta root**: la cuenta principal de AWS, con control total (incluida facturación). No se usa para operaciones del día a día por razones de seguridad.

**Usuario IAM**: una identidad separada de la cuenta root, con permisos acotados, usada para tareas operativas (ej: que Terraform despliegue recursos).

**Rol de ejecución (execution role)**: el rol de IAM que usa una Lambda para tener permiso de acceder a otros servicios (ej: leer de una cola, escribir logs).

**Policy (política)**: un documento que define qué acciones están permitidas sobre qué recursos.

**Principio de menor privilegio**: dar solo los permisos mínimos necesarios, no más. (En el curso se usó `AdministratorAccess` para simplificar el aprendizaje, con la salvedad explícita de que en un trabajo real se restringiría.)

**Access key**: credenciales (ID + secreto) que permiten usar la API/CLI de AWS en nombre de un usuario IAM.

---

## Facturación

**Free Tier**: límites de uso gratuito de AWS. Existen dos modelos: el clásico (12 meses + "always free" de por vida) y el "Free account plan" (créditos iniciales, sin cobro directo mientras dure el plan).

**Billing alarm**: alarma de CloudWatch que avisa (por ejemplo, por email vía SNS) cuando el gasto estimado supera un umbral.

---

## Infraestructura como código

**Terraform**: herramienta para definir infraestructura en archivos de configuración (`.tf`) en vez de crearla a mano en la consola.

**Provider**: en Terraform, el plugin que sabe hablar con una nube específica (ej: `hashicorp/aws`).

**LocalStack**: herramienta que simula servicios de AWS localmente (en Docker), para practicar sin tocar una cuenta real.

**terraform apply / destroy**: comandos para crear (`apply`) o eliminar (`destroy`) los recursos definidos en el código.

---

## Código / patrones de Node.js

**async/await**: sintaxis de JavaScript para trabajar con código asíncrono (operaciones que tardan, como llamar a una base de datos) de forma secuencial y legible.

**try/catch**: bloque para atrapar errores. Sin él, un error en una promesa (`await`) sin manejar corta la ejecución sin control.

**Idempotencia**: una operación es idempotente si ejecutarla varias veces con la misma clave da el mismo resultado que ejecutarla una sola vez. Crítico quality en pagos, colas, y cualquier operación que se pueda reintentar.

**Variables de entorno**: forma de inyectar configuración (nombres de tabla, URLs, etc.) desde afuera del código, para que el mismo código sirva en distintos ambientes sin modificarse.

**CommonJS vs ES Modules (ESM)**: dos formas de organizar módulos en Node.js. CommonJS usa `require`/`module.exports`; ESM usa `import`/`export`. La consola de Lambda crea los archivos como `.mjs` (ESM) por defecto.

---

## Para repasar rápido antes de la entrevista

Preguntas típicas que se arman a partir de estos conceptos:
- ¿Por qué usarías una cola en vez de llamar directo a un servicio?
- ¿Qué pasa si tu Lambda falla a mitad de camino?
- ¿Por qué no usar la cuenta root para desplegar?
- ¿Cuándo elegirías DynamoDB en vez de una base SQL?
- ¿Qué es un cold start y cómo se mitiga?
- ¿Por qué importa la idempotencia en sistemas distribuidos?

---

## Términos que se charlaron por la idea, sin nombrarlos técnicamente

Estos conceptos aparecieron en las explicaciones y ejercicios, pero sin ponerles la palabra exacta en su momento. Quedan acá para tener el nombre técnico correcto a mano.

**Desacoplamiento (decoupling)**: separar dos componentes (ej: productor y consumidor) para que no dependan del tiempo ni la disponibilidad del otro. Es el concepto central detrás de usar una cola en vez de llamar directo a un servicio (Módulo 03).

**Ack (acknowledgment)**: la confirmación que un consumidor le da a la cola de que terminó de procesar un mensaje con éxito. En SQS, si el consumidor no confirma (porque falla o tarda demasiado), el mensaje se considera no procesado y vuelve a estar disponible — esto es lo que se vio en el experimento de fallos del Módulo 03 (AWS real).

**Resiliencia**: la capacidad de un sistema de seguir funcionando (o recuperarse) frente a fallos parciales, sin perder trabajo ni caerse por completo. La cola SQS le da resiliencia al sistema porque el trabajo no se pierde si el consumidor falla.

**Buffer**: un lugar donde se acumula temporalmente el trabajo pendiente entre dos componentes que van a velocidades distintas. La cola SQS actúa como buffer entre el productor y el consumidor.

**Fan-out**: patrón donde un mismo mensaje/evento se distribuye a **varios** destinos a la vez (ej: SNS mandando la misma notificación a varias colas SQS suscriptas). Se mencionó como la solución cuando dos Lambdas distintas necesitan reaccionar al mismo evento (Módulo 04).

**Batch**: un lote de varios mensajes/registros que llegan juntos en una sola invocación. Un evento de SQS hacia una Lambda puede traer varios mensajes en un solo `event.Records`, en vez de invocar la Lambda una vez por mensaje.

**Fail-fast**: la práctica de hacer que un programa falle de inmediato y con un mensaje claro cuando falta algo indispensable (ej: una variable de entorno obligatoria), en vez de seguir ejecutando con un valor por defecto silencioso que puede esconder un error más grave después (Módulo 06).

---

## Conclusiones clave de las clases (apuntes concisos)

Ideas centrales que se llegaron a razonar en el curso, en formato pregunta → conclusión. Sirven para repasar el "por qué" sin releer toda la explicación larga.

### ¿Por qué una cola da resiliencia? (Módulo 03)

**Escenario**: el consumidor está procesando un pedido y se cae a mitad de camino (crashea, se queda sin memoria, etc.).

**Sin cola**: el pedido se pierde. No queda registrado en ningún lado que "esto todavía hay que hacerlo" — simplemente desaparece.

**Con cola**: el mensaje sigue guardado en la cola hasta que el consumidor confirma (`ack`) que lo procesó bien. Si se cae antes de confirmar, el mensaje vuelve a estar disponible — lo agarra otro consumidor, o el mismo cuando se recupera.

**Conclusión**: las colas no son solo "para ir más rápido" — son, sobre todo, para **no perder trabajo cuando algo falla**. Y en sistemas distribuidos, algo *siempre* falla en algún momento.

Comprobado en la práctica en el Módulo 03 (AWS real): se hizo fallar al consumidor a propósito 5 veces seguidas, y el mensaje nunca se perdió — se reintentó automáticamente hasta que el código se arregló y se procesó bien.
