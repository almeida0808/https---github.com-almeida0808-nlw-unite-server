import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clients/:clientId/check-in",
    {
      schema: {
        params: z.object({
          clientId: z.coerce.number().int(),
        }),
      },
    },
    async (request, response) => {
      const { clientId } = request.params;
      const clientsCheckIn = await prisma.checkIn.findUnique({
        where: {
          clientId,
        },
      });
      if (clientsCheckIn !== null) {
        throw new Error("Este usuário já realizou o check-in.");
      }
      await prisma.checkIn.create({
        data: {
          clientId,
        },
      });
      return response.status(201).send();
    }
  );
}
