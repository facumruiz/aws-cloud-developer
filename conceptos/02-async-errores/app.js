// app.js
// Corré con: node app.js
//
// Concepto: en AWS real, cada llamada a DynamoDB, S3, etc. es asíncrona
// (tarda un tiempo, puede fallar por red, permisos, etc).
// Una Lambda SIEMPRE tiene que manejar esos errores, o el cliente
// se queda esperando una respuesta que nunca llega (timeout).

// Simulamos una "base de datos" que a veces falla (como pasa en la vida real:
// problemas de red, throttling, etc.)
function guardarEnBaseDeDatosFalsa(dato) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const falla = Math.random() < 0.4; // 40% de probabilidad de error, a propósito
      if (falla) {
        reject(new Error("La base de datos no respondió (simulado)"));
      } else {
        resolve({ id: 1, ...dato });
      }
    }, 200);
  });
}

// ❌ MAL: si guardarEnBaseDeDatosFalsa falla, esto tira una excepción
// no controlada y la Lambda "revienta" sin devolver una respuesta prolija.
async function handlerMalo(event) {
  const dato = JSON.parse(event.body);
  const resultado = await guardarEnBaseDeDatosFalsa(dato);
  return { statusCode: 201, body: JSON.stringify(resultado) };
}

// ✅ BIEN: envolvemos en try/catch y devolvemos un error controlado (500),
// con un mensaje que no expone detalles internos al cliente.
async function handlerBueno(event) {
  const dato = JSON.parse(event.body);

  try {
    const resultado = await guardarEnBaseDeDatosFalsa(dato);
    return { statusCode: 201, body: JSON.stringify(resultado) };
  } catch (err) {
    console.error("Error guardando:", err.message); // esto sí queda en los logs (CloudWatch en AWS real)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "No se pudo guardar, intentá de nuevo" }),
    };
  }
}

// --- Probamos varias veces, porque el fallo es aleatorio ---
async function main() {
  console.log("--- Con handlerBueno (5 intentos) ---");
  for (let i = 0; i < 5; i++) {
    const res = await handlerBueno({ body: JSON.stringify({ title: `intento ${i}` }) });
    console.log(res);
  }

  console.log("\n--- Con handlerMalo (puede tirar una excepción sin controlar) ---");
  try {
    for (let i = 0; i < 5; i++) {
      const res = await handlerMalo({ body: JSON.stringify({ title: `intento ${i}` }) });
      console.log(res);
    }
  } catch (err) {
    console.log("💥 handlerMalo explotó sin devolver respuesta HTTP:", err.message);
  }
}

main();
