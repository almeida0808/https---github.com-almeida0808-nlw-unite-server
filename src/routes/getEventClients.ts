import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEventClients(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/clients",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {},
      },
    },
    async (request, response) => {
      const { eventId } = request.params;

      const clients = prisma.client.findMany({
        where: {
          eventId,
        },
      });
      return response.send({ clients });
    }
  );
}
