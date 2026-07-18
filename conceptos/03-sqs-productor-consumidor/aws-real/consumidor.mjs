// consumidor.mjs
// Versión que realmente funcionó en la consola (ES Modules).
export const handler = async (event) => {
  for (const record of event.Records) {
    const pedido = JSON.parse(record.body);
    console.log(`Procesando pedido ${pedido.orderId} (${pedido.item})...`);

    // Acá iría la lógica real: guardar en DynamoDB, mandar un email, etc.

    console.log(`Pedido ${pedido.orderId} procesado.`);
  }
};
