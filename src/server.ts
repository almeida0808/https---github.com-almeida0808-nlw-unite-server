import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async (request, response) => {
  const createEventsSchema = z.object({
    // faz algumas validações pra criar um evento no banco de dados
    title: z.string().min(4), // o title tem que ser uma string com no min 4 caracteres
    details: z.string().nullable(), // details tem que ser uma string, porem é um campo opcional
    maximumClients: z.number().int().positive().nullable(), // tem que ser um número, inteiro, positivo, porem é opcional
  });

  const data = createEventsSchema.parse(request.body);

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumClients: data.maximumClients,
      slug: new Date().toISOString(),
    },
  });
  return response.status(201).send({ eventId: event.id });
});

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
