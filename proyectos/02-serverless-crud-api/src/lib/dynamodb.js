// src/lib/dynamodb.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Contra LocalStack, el endpoint se pisa con la variable de entorno AWS_ENDPOINT_URL
// (se configura en la Lambda vía Terraform). En AWS real, este valor no existe
// y el SDK usa el endpoint real automáticamente.
const client = new DynamoDBClient({
  endpoint: process.env.AWS_ENDPOINT_URL,
  region: process.env.AWS_REGION || "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };
