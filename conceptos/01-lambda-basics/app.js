// app.js
// Corré esto con: node app.js
//
// Esto NO usa AWS, Docker, ni nada. Es 100% Node.js puro.
// La idea es que entiendas el PATRÓN que usa una Lambda real,
// sin pelearte con infraestructura mientras aprendés.

// --- "Base de datos" en memoria (en AWS real, esto sería DynamoDB) ---
let tasks = [];
let nextId = 1;

// --- Funciones que simulan Lambdas reales ---
// Fijate: cada una recibe un "event" (así llega siempre en AWS Lambda)
// y devuelve { statusCode, body } (así espera la respuesta API Gateway)

function createTask(event) {
  const input = JSON.parse(event.body);

  if (!input.title || typeof input.title !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "title es obligatorio" }) };
  }

  const task = { id: nextId++, title: input.title, done: false };
  tasks.push(task);

  return { statusCode: 201, body: JSON.stringify(task) };
}

function listTasks() {
  return { statusCode: 200, body: JSON.stringify(tasks) };
}

function getTask(event) {
  const id = Number(event.pathParameters.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return { statusCode: 404, body: JSON.stringify({ error: "no encontrada" }) };
  }
  return { statusCode: 200, body: JSON.stringify(task) };
}

function updateTask(event) {
  const id = Number(event.pathParameters.id);
  const input = JSON.parse(event.body);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return { statusCode: 404, body: JSON.stringify({ error: "no encontrada" }) };
  }

  if (input.done !== undefined) task.done = input.done;
  if (input.title !== undefined) task.title = input.title;

  return { statusCode: 200, body: JSON.stringify(task) };
}

function deleteTask(event) {
  const id = Number(event.pathParameters.id);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === before) {
    return { statusCode: 404, body: JSON.stringify({ error: "no encontrada" }) };
  }
  return { statusCode: 204, body: "" };
}

// --- Simulación de llamadas HTTP reales (esto normalmente lo hace API Gateway) ---

console.log("--- 1) Creo una tarea ---");
let res = createTask({ body: JSON.stringify({ title: "Aprender AWS" }) });
console.log(res);
const createdTask = JSON.parse(res.body);

console.log("\n--- 2) Listo todas ---");
console.log(listTasks());

console.log("\n--- 3) Busco la tarea por id ---");
console.log(getTask({ pathParameters: { id: createdTask.id } }));

console.log("\n--- 4) La marco como hecha ---");
console.log(updateTask({ pathParameters: { id: createdTask.id }, body: JSON.stringify({ done: true }) }));

console.log("\n--- 5) La borro ---");
console.log(deleteTask({ pathParameters: { id: createdTask.id } }));

console.log("\n--- 6) Busco de nuevo (debería dar 404) ---");
console.log(getTask({ pathParameters: { id: createdTask.id } }));
