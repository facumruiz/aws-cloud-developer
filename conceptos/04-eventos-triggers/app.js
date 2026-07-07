// app.js
// Corré con: node app.js
//
// Concepto: en AWS, un Lambda puede dispararse automáticamente por un EVENTO,
// sin que nadie lo llame directamente vía HTTP. El ejemplo clásico:
// "cuando se sube un archivo a este bucket S3, corré esta función."
//
// Esto es "event-driven architecture": el código reacciona a que algo pasó,
// en vez de que alguien lo invoque a propósito.

// --- Simulamos un bucket S3 con eventos ---
class BucketSimulado {
  constructor(nombre) {
    this.nombre = nombre;
    this.archivos = {};
    this.listeners = []; // funciones que "escuchan" cuando se sube algo
  }

  // En AWS real, esto se configura en Terraform/consola como un "trigger".
  // Acá lo simulamos con un simple patrón observer.
  onSubidaDeArchivo(callback) {
    this.listeners.push(callback);
  }

  subirArchivo(nombreArchivo, contenido) {
    console.log(`\n📁 Subiendo "${nombreArchivo}" a ${this.nombre}...`);
    this.archivos[nombreArchivo] = contenido;

    // Esto es lo que hace AWS automáticamente: dispara la Lambda con un
    // "event" que describe QUÉ pasó y DÓNDE, no el contenido en sí.
    const event = {
      bucket: this.nombre,
      key: nombreArchivo,
      size: contenido.length,
      timestamp: new Date().toISOString(),
    };

    this.listeners.forEach((lambda) => lambda(event));
  }
}

// --- La "Lambda" que reacciona al evento (esto sería procesarImagenLambda) ---
function procesarArchivoSubido(event) {
  console.log(`⚡ Trigger disparado: se subió "${event.key}" (${event.size} bytes)`);

  if (event.key.endsWith(".jpg") || event.key.endsWith(".png")) {
    console.log(`🖼️  Es una imagen, la mandaría a procesar (resize, thumbnail, etc.)`);
  } else if (event.key.endsWith(".csv")) {
    console.log(`📊 Es un CSV, dispararía un proceso de importación a la base de datos`);
  } else {
    console.log(`❓ Tipo de archivo no reconocido, no hago nada`);
  }
}

// --- Armamos el escenario ---
const bucket = new BucketSimulado("mi-bucket-fotos");
bucket.onSubidaDeArchivo(procesarArchivoSubido);

bucket.subirArchivo("vacaciones.jpg", "contenido-binario-simulado");
bucket.subirArchivo("ventas-marzo.csv", "id,producto,monto");
bucket.subirArchivo("notas.txt", "esto es un archivo de texto");
