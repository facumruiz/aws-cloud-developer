// src/handler.js
// Lambda simple: responde con un saludo + timestamp.
// El frontend estático (en S3) va a llamar a este endpoint via API Gateway.

exports.handler = async (event) => {
  const name = event?.queryStringParameters?.name || "mundo";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // necesario para que el frontend en S3 pueda llamarlo
    },
    body: JSON.stringify({
      message: `Hola, ${name}! Esto vino de una Lambda real.`,
      timestamp: new Date().toISOString(),
    }),
  };
};
