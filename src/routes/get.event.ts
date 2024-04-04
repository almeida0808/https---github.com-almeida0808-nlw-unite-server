import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { nullable, string, z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
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
              clients: true,
            },
          },
        },

        where: {
          id: eventId,
        },
      });

      if (event === null) {
        throw new Error("Ops... Este evento não existe.");
      }

      const VagasDisponiveis = `${event._count.clients}/${event.maximumClients}`;

      return response.send({
        event: {
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          VagasDisponiveis,
        },
      });
    }
  );
}
