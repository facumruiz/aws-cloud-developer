// app.js
// Corré con: node app.js
//
// Concepto: en sistemas distribuidos, la MISMA operación puede ejecutarse
// más de una vez por error. Ejemplo típico: el cliente no recibió la
// respuesta a tiempo (por un problema de red) y reintenta el mismo pedido,
// pero en realidad el servidor SÍ lo había procesado la primera vez.
//
// Una operación es "idempotente" si ejecutarla 2 veces (o 10) da el MISMO
// resultado que ejecutarla 1 vez. Esto es crítico en pagos, envío de emails,
// creación de pedidos: no querés cobrarle 2 veces a alguien por un reintento.

const crypto = require("crypto");


// --- Simulamos pedidos, cada uno con un "idempotency key" único que manda el cliente ---
const pedidosYaProcesados = new Map(); // key -> resultado

// ❌ MAL: cada vez que llega el request, crea un pedido nuevo, sin chequear
// si ya se había procesado antes.
function crearPedidoNoIdempotente(input) {
  const pedido = { id: crypto.randomUUID(), item: input.item, monto: input.monto };
  console.log(`💸 Pedido creado (SIN control): ${pedido.id} - $${pedido.monto}`);
  return pedido;
}

// ✅ BIEN: usa una clave de idempotencia que manda el cliente (por ejemplo,
// generada una sola vez en el frontend antes de reintentar). Si ya se procesó
// esa clave, devuelve el resultado guardado en vez de crear un pedido nuevo.
function crearPedidoIdempotente(input) {
  if (pedidosYaProcesados.has(input.idempotencyKey)) {
    console.log(`🔁 Pedido repetido detectado (key: ${input.idempotencyKey}), devuelvo el mismo resultado`);
    return pedidosYaProcesados.get(input.idempotencyKey);
  }

  const pedido = { id: crypto.randomUUID(), item: input.item, monto: input.monto };
  pedidosYaProcesados.set(input.idempotencyKey, pedido);
  console.log(`💸 Pedido creado (CON control): ${pedido.id} - $${pedido.monto}`);
  return pedido;
}

console.log("=== Simulación: el cliente reintenta el mismo pedido 3 veces (por un timeout de red) ===\n");

console.log("--- Sin idempotencia (❌ genera 3 pedidos y cobra 3 veces) ---");
const input = { item: "Suscripción Pro", monto: 999 };
crearPedidoNoIdempotente(input);
crearPedidoNoIdempotente(input); // mismo input, pero se crea OTRO pedido
crearPedidoNoIdempotente(input); // y OTRO más

console.log("\n--- Con idempotencia (✅ detecta el reintento y no duplica) ---");
const inputConKey = { item: "Suscripción Pro", monto: 999, idempotencyKey: "key-abc-123" };
crearPedidoIdempotente(inputConKey);
crearPedidoIdempotente(inputConKey); // mismo key -> devuelve el pedido ya creado
crearPedidoIdempotente(inputConKey); // mismo key -> devuelve el pedido ya creado
