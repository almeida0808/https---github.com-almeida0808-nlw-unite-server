import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSlug } from "../utils/CreateSlug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/badRequest";

export async function CreateEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          // faz algumas validações pra criar um evento no banco de dados
          title: z.string().min(4), // o title tem que ser uma string com no min 4 caracteres
          details: z.string().nullable(), // details tem que ser uma string, porem é um campo opcional
          maximumClients: z.number().int().positive().nullable(), // tem que ser um número, inteiro, positivo, porem é opcional
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, response) => {
      const { title, details, maximumClients } = request.body;

      const slug = createSlug(title);

      // caso não encontre um slug existente, ele retorna null
      const eventWithSameSlug = await prisma.event.findUnique({
        // findUnique busca um campo unico na nossa tabela
        where: { slug },
      });

      if (eventWithSameSlug !== null) {
        // caso a resposta seja diferente de null return esse error
        response.status(400);
        throw new BadRequest(
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
    }
  );
}
