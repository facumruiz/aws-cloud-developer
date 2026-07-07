// app.js
// Corré con: node app.js
//
// Concepto: en vez de que una Lambda haga TODO el trabajo de una (recibir el
// pedido Y procesarlo), se separa en dos pasos conectados por una cola:
//   1. Un "productor" mete el trabajo en la cola y responde RÁPIDO al cliente
//   2. Un "consumidor" (en otro momento, otra Lambda) procesa la cola
//
// Ventaja clave: si el procesamiento tarda o falla, el cliente ya recibió
// su respuesta y no se queda esperando. Y si el consumidor se cae, el
// mensaje sigue en la cola para reintentarlo (no se pierde el trabajo).

// --- Simulamos una cola SQS con un array ---
class ColaSimulada {
  constructor() {
    this.mensajes = [];
  }

  enviar(mensaje) {
    this.mensajes.push({ body: mensaje, intentos: 0 });
    console.log(`📤 Mensaje encolado: ${JSON.stringify(mensaje)}`);
  }

  // Simula lo que hace AWS: entrega mensajes al consumidor
  recibir() {
    return this.mensajes.shift(); // en SQS real esto es "long polling", acá simplificado
  }

  get cantidadPendiente() {
    return this.mensajes.length;
  }
}

const cola = new ColaSimulada();

// --- PRODUCTOR: recibe el pedido HTTP y solo encola, responde rápido ---
function productor(event) {
  const pedido = JSON.parse(event.body);

  cola.enviar({ orderId: pedido.orderId, item: pedido.item });

  // El cliente recibe esta respuesta YA, sin esperar a que se procese el pedido.
  return { statusCode: 202, body: JSON.stringify({ mensaje: "Pedido recibido, procesando..." }) };
}

// --- CONSUMIDOR: procesa los mensajes de la cola (esto correría en otra Lambda,
// disparada automáticamente por AWS cuando hay mensajes nuevos en la cola real) ---
function consumidor() {
  const mensaje = cola.recibir();
  if (!mensaje) {
    console.log("No hay mensajes pendientes.");
    return;
  }

  console.log(`⚙️  Procesando pedido ${mensaje.body.orderId} (${mensaje.body.item})...`);
  // Acá iría la lógica real: guardar en DynamoDB, mandar un email, etc.
  console.log(`✅ Pedido ${mensaje.body.orderId} procesado.`);
}

// --- Simulación completa ---
console.log("=== 3 clientes hacen pedidos casi al mismo tiempo ===\n");

console.log(productor({ body: JSON.stringify({ orderId: 1, item: "Teclado" }) }));
console.log(productor({ body: JSON.stringify({ orderId: 2, item: "Mouse" }) }));
console.log(productor({ body: JSON.stringify({ orderId: 3, item: "Monitor" }) }));

console.log(`\nMensajes en cola esperando: ${cola.cantidadPendiente}`);
console.log("\n=== El consumidor procesa la cola, uno por uno ===\n");

consumidor();
consumidor();
consumidor();
consumidor(); // ya no queda nada, para ver el caso "cola vacía"
