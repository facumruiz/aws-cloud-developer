// productor.js
// Lambda que RECIBE un pedido y lo manda a una cola SQS real.
// Responde rápido (202), sin esperar a que el pedido se procese.

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL; // viene de la config de la Lambda, no hardcodeado

exports.handler = async (event) => {
  if (!QUEUE_URL) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falta configurar QUEUE_URL" }) };
  }

  const pedido = { orderId: event.orderId, item: event.item };

  try {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(pedido),
      })
    );

    return {
      statusCode: 202,
      body: JSON.stringify({ mensaje: "Pedido recibido, procesando...", pedido }),
    };
  } catch (err) {
    console.error("Error encolando el pedido:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: "No se pudo encolar el pedido" }) };
  }
};
