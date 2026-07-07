// src/handlers/getTask.js
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamodb");
const { response } = require("../lib/response");

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  const result = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );

  if (!result.Item) {
    return response(404, { error: `Tarea ${id} no encontrada` });
  }

  return response(200, result.Item);
};
