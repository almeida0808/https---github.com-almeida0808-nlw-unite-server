import {
  BadRequest
} from "./chunk-OH33D4AI.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get.event.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get events",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        })
      }
    },
    async (request, response) => {
      const { eventId } = request.params;
      const event = await prisma.event.findUnique({
        select: {
          title: true,
          details: true,
          slug: true,
          id: true,
          maximumClients: true,
          _count: {
            select: {
              clients: true
            }
          }
        },
        where: {
          id: eventId
        }
      });
      if (event === null) {
        throw new BadRequest("Ops... Este evento n\xE3o existe.");
      }
      const VagasDisponiveis = `${event._count.clients}/${event.maximumClients}`;
      return response.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          VagasDisponiveis
        }
      });
    }
  );
}

export {
  getEvent
};
