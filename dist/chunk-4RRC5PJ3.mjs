import {
  createSlug
} from "./chunk-3MXUBCIK.mjs";
import {
  BadRequest
} from "./chunk-OH33D4AI.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/createEvents.ts
import { z } from "zod";
async function CreateEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          // faz algumas validações pra criar um evento no banco de dados
          title: z.string().min(4),
          // o title tem que ser uma string com no min 4 caracteres
          details: z.string().nullable(),
          // details tem que ser uma string, porem é um campo opcional
          maximumClients: z.number().int().positive().nullable()
          // tem que ser um número, inteiro, positivo, porem é opcional
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, response) => {
      const { title, details, maximumClients } = request.body;
      const slug = createSlug(title);
      const eventWithSameSlug = await prisma.event.findUnique({
        // findUnique busca um campo unico na nossa tabela
        where: { slug }
      });
      if (eventWithSameSlug !== null) {
        response.status(400);
        throw new BadRequest(
          "Ops.. J\xE1 existe um evento com esse nome, tente novamente."
        );
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumClients,
          slug
        }
      });
      return response.status(201).send({ eventId: event.id });
    }
  );
}

export {
  CreateEvent
};
