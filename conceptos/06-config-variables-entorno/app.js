// app.js
// Corré con: node app.js
// Después probá: TABLE_NAME=otra-tabla node app.js  (para ver cómo cambia)
//
// Concepto: el código nunca debería tener "hardcodeado" el nombre de una
// tabla, una URL, una clave, etc. Esos valores cambian entre ambientes
// (desarrollo, staging, producción) y se inyectan desde AFUERA del código,
// vía variables de entorno. En Lambda real, esto se configura en Terraform
// (bloque "environment { variables = {...} }", como ya viste en el proyecto 2).

// ❌ MAL: el nombre de la tabla está escrito directo en el código.
// Si mañana necesitás una tabla de "staging" distinta, hay que TOCAR el código.
function guardarTareaHardcodeado(tarea) {
  const tableName = "tasks-produccion"; // 🚩 mal: hardcodeado
  console.log(`Guardando en la tabla "${tableName}" (hardcodeada): ${JSON.stringify(tarea)}`);
}

// ✅ BIEN: el nombre de la tabla viene de una variable de entorno.
// El MISMO código sirve para dev, staging y producción, solo cambia
// la configuración de afuera (nunca el código).
function guardarTareaConConfig(tarea) {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    // Fallar rápido y claro si falta configuración es mejor que
    // seguir con un valor por defecto silencioso que puede ser peligroso
    // (ej: escribir por error en la tabla de producción).
    throw new Error("Falta la variable de entorno TABLE_NAME");
  }

  console.log(`Guardando en la tabla "${tableName}" (desde variable de entorno): ${JSON.stringify(tarea)}`);
}

console.log("=== Con hardcodeo (siempre la misma tabla, sin importar el ambiente) ===");
guardarTareaHardcodeado({ title: "Tarea de prueba" });

console.log("\n=== Con variable de entorno ===");
try {
  guardarTareaConConfig({ title: "Tarea de prueba" });
} catch (err) {
  console.log(`⚠️  Error esperado (no seteaste TABLE_NAME): ${err.message}`);
  console.log("👉 Probá de nuevo así: TABLE_NAME=tasks-dev node app.js");
}
