import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { createSlug } from "./utils/CreateSlug";
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

  const { title, details, maximumClients } = createEventsSchema.parse(
    request.body
  );
  const slug = createSlug(title);

  // caso não encontre um slug existente, ele retorna null
  const eventWithSameSlug = await prisma.event.findUnique({
    // findUnique busca um campo unico na nossa tabela
    where: { slug },
  });

  if (eventWithSameSlug !== null) {
    // caso a resposta seja diferente de null return esse error
    response.status(400);
    throw new Error(
      "Ops.. Já existe um evento com esse nome, tente novamente."
    );
  }
  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumClients,
      slug,
    },
  });
  return response.status(201).send({ eventId: event.id });
});

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
