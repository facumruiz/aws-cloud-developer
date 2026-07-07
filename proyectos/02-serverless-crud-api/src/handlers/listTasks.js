// src/handlers/listTasks.js
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamodb");
const { response } = require("../lib/response");

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async () => {
  // Scan es simple y suficiente para este volumen de práctica.
  // En un caso real con mucho volumen, se preferiría Query con un índice
  // en vez de Scan (que recorre toda la tabla).
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );

  return response(200, result.Items || []);
};
