// src/handlers/updateTask.js
const { UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamodb");
const { taskInputSchema } = require("../lib/schema");
const { response } = require("../lib/response");

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const id = event.pathParameters?.id;

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Body inválido, se esperaba JSON" });
  }

  const parsed = taskInputSchema.partial().safeParse(input);
  if (!parsed.success) {
    return response(400, { error: "Datos inválidos", details: parsed.error.flatten() });
  }

  // Verificamos que exista antes de actualizar, para devolver 404 en vez de
  // crear un item nuevo "fantasma" con un update sobre un id inexistente.
  const existing = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  if (!existing.Item) {
    return response(404, { error: `Tarea ${id} no encontrada` });
  }

  const updateFields = { ...existing.Item, ...parsed.data };

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET title = :title, done = :done",
      ExpressionAttributeValues: {
        ":title": updateFields.title,
        ":done": updateFields.done,
      },
    })
  );

  return response(200, { id, ...updateFields });
};
