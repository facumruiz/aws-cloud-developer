// src/handlers/deleteTask.js
const { DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamodb");
const { response } = require("../lib/response");

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  const existing = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  if (!existing.Item) {
    return response(404, { error: `Tarea ${id} no encontrada` });
  }

  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
  );

  return response(204, null);
};
