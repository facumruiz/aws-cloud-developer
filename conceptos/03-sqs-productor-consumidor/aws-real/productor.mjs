// productor.mjs
// Versión que realmente funcionó en la consola de Lambda (ES Modules).
// El runtime Node.js 20.x en la consola crea el archivo como .mjs por
// defecto, por eso usa import/export en vez de require/exports (CommonJS,
// que es lo que tiene productor.js — válido si se despliega con Terraform).

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL;

export const handler = async (event) => {
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
