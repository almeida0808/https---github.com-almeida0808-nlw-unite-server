import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { number, object, string, z } from "zod";
import { prisma } from "../lib/prisma";

export async function getClientBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clients/:clientId/badge",
    {
      schema: {
        params: z.object({
          clientId: z.string().transform(Number),
        }),
        response:{
200: z.object({
  badge: z.object({
    name: z.string(),
    email: z.string().email(),
    id: z.number().int(),
    eventTitle: z.string(),
    checkInURL: z.string().url()
  }),
})
        }
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

      
      const baseURL = `${request.protocol}://${request.hostname}`
      console.log( baseURL )

      const checkInURL = new URL(`/clients/${client.id}/check-in`, baseURL)
      
      return response.send({
        badge: {
          name: client?.name,
          email: client?.email,
          id: client?.id,
          eventTitle: client.event.title,
          checkInURL: checkInURL.toString()
        },
      });
    }
  );
}
