// index.js
// Este es el código para pegar en la consola de Lambda (AWS real).
// Es el MISMO patrón que ya viste en app.js, pero con un detalle importante:
// acá vas a comprobar en carne propia que la memoria de una Lambda NO es
// confiable entre invocaciones (por eso en el Proyecto 2 usamos DynamoDB).

let tasks = [];
let nextId = 1;

exports.handler = async (event) => {
  const action = event.action; // le decimos qué operación hacer desde el "Test event"

  switch (action) {
    case "create": {
      const task = { id: nextId++, title: event.title, done: false };
      tasks.push(task);
      return { statusCode: 201, body: JSON.stringify(task) };
    }

    case "list": {
      return { statusCode: 200, body: JSON.stringify(tasks) };
    }

    default:
      return { statusCode: 400, body: JSON.stringify({ error: "acción no reconocida" }) };
  }
};
