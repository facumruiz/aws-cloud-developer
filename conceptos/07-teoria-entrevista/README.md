# 07 - Teoría para la entrevista (sin código)

Esto no se practica con `node`, se **entiende y se explica con tus palabras**. Son las preguntas de concepto que más se repiten en entrevistas de nivel junior/mid para roles cloud/serverless.

## Cold starts

Cuando una Lambda no se usó hace rato, AWS tiene que "despertarla": levantar un contenedor nuevo, cargar el código, inicializar el runtime. Eso tarda un poco más (cientos de ms a un par de segundos) que una invocación cuando ya está "caliente" (el contenedor sigue vivo de una llamada anterior).

**Cómo se mitiga**: mantener las Lambdas livianas (menos dependencias = arranca más rápido), usar "provisioned concurrency" (le decís a AWS que mantenga N instancias siempre calientes, tiene costo extra), o elegir runtimes más rápidos para arrancar (Node y Python arrancan más rápido que Java, por ejemplo).

## Memoria vs. tiempo de ejecución

En Lambda, vos configurás cuánta memoria le das a la función (128MB a 10GB). Lo que mucha gente no sabe: **más memoria también te da más CPU proporcional**. A veces subir la memoria hace que la función corra más rápido y termine costando *menos* en total, aunque el precio por milisegundo sea mayor (porque corre menos milisegundos).

**Timeout**: cada Lambda tiene un límite de tiempo de ejecución configurable (máximo 15 minutos). Si tu proceso puede tardar más que eso, Lambda no es la herramienta correcta (ahí entrarían ECS/Fargate o Step Functions para orquestar procesos largos).

## Límites de Lambda (los que más se preguntan)

- Timeout máximo: 15 minutos
- Memoria: 128MB - 10GB
- Tamaño del paquete de despliegue: 50MB comprimido (250MB descomprimido) si se sube directo, más si se usa una imagen de contenedor
- Ejecuciones concurrentes: hay un límite por cuenta/región (se puede pedir aumentarlo)

## DynamoDB vs. una base SQL (RDS/PostgreSQL/MySQL)

| | DynamoDB | SQL (RDS) |
|---|---|---|
| Modelo | NoSQL, clave-valor / documentos | Relacional, tablas con joins |
| Escalado | Automático, pensado para mucho volumen | Requiere planificar capacidad |
| Consultas | Simples y rápidas si sabés la clave; joins complejos son difíciles/no existen | Consultas complejas con JOIN, agregaciones, son el punto fuerte |
| Cuándo usarlo | Alto volumen, acceso predecible por clave (ej: "dame la tarea con id X") | Cuando necesitás relaciones complejas entre entidades y consultas ad-hoc |

**La pregunta típica de entrevista**: "¿cuándo elegirías DynamoDB en vez de una base SQL?" — Respuesta corta: cuando conocés de antemano los patrones de acceso (cómo vas a consultar los datos) y necesitás escalar sin gestionar infraestructura; si necesitás flexibilidad para hacer consultas complejas que no anticipaste, SQL es más apropiado.

## Para practicar (aunque sea teórico)

Escribí, con tus propias palabras y sin mirar esto, una respuesta corta (3-4 líneas) a cada una de estas 4 preguntas. Es el mejor ejercicio para prepararte a explicarlo en una entrevista real, no solo a "saberlo".
