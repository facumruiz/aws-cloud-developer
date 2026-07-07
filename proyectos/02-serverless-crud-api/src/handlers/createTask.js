// src/handlers/createTask.js
const { randomUUID } = require("crypto");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamodb");
const { taskInputSchema } = require("../lib/schema");
const { response } = require("../lib/response");

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Body inválido, se esperaba JSON" });
  }

  const parsed = taskInputSchema.safeParse(input);
  if (!parsed.success) {
    return response(400, { error: "Datos inválidos", details: parsed.error.flatten() });
  }

  const task = {
    id: randomUUID(),
    title: parsed.data.title,
    done: parsed.data.done,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: task,
    })
  );

  return response(201, task);
};
