// src/lib/schema.js
const { z } = require("zod");

// Lo que el cliente puede mandar al crear/actualizar una tarea
const taskInputSchema = z.object({
  title: z.string().min(1, "title es obligatorio").max(200),
  done: z.boolean().optional().default(false),
});

module.exports = { taskInputSchema };
