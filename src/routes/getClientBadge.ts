import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { number, z } from "zod";
import { prisma } from "../lib/prisma";

export async function getClientBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clients/:clientId/badge",
    {
      schema: {
        params: z.object({
          clientId: z.string().transform(Number),
        }),
      },
    },
    async (request, response) => {
      const { clientId } = request.params;
      const client = await prisma.client.findUnique({
        select: {
          name: true,
          email: true,
          id: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: clientId,
        },
      });

      if (client === null) {
        throw new Error("Esse usuário não existe.");
      }

      return response.send({
        client: {
          name: client?.name,
          email: client?.email,
          id: client?.id,
          event: client.event.title,
        },
      });
    }
  );
}
