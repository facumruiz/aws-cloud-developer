// consumidor.js
// Lambda que se dispara SOLA cuando hay mensajes en la cola SQS (trigger automático).
// No la invoca el cliente ni el productor directamente: la invoca AWS.

exports.handler = async (event) => {
  // Un evento de SQS puede traer VARIOS mensajes juntos en un solo batch.
  for (const record of event.Records) {
    const pedido = JSON.parse(record.body);
    console.log(`Procesando pedido ${pedido.orderId} (${pedido.item})...`);

    // Acá iría la lógica real: guardar en DynamoDB, mandar un email, etc.

    console.log(`Pedido ${pedido.orderId} procesado.`);
  }
};
