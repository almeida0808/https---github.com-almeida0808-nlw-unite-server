import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { number } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventClients(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/clients",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullable(),
          pageIndex: z.string().nullable().default("0").transform(Number),
        }),
        response: {},
      },
    },
    async (request, response) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;
      const clients = await prisma.client.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          CheckIn: {
            select: {
              createdAt: true,
            },
          },
        },
        where: {
          eventId,
        },
        take: 10,
        skip: pageIndex * 10,
      });
      return response.send({
        clients: clients.map((clients) => {
          return {
            id: clients.id,
            name: clients.name,
            email: clients.email,
            createdAt: clients.createdAt,
            checkedInAt: clients.CheckIn?.createdAt,
          };
        }),
      });
    }
  );
}
