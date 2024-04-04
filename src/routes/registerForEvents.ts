import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { string, z } from "zod";
import { request } from "http";
import { stdin } from "process";
import { prisma } from "../lib/prisma";

export async function registerFromEvents(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/clients",
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            clientId: z.number().int(),
          }),
        },
      },
    },
    async (request, response) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const clientFromEmail = await prisma.client.findUnique({
        where: {
          eventId_email: { email, eventId },
        },
      });

      if (clientFromEmail !== null) {
        throw new Error("Este Usuário ja foi cadastrado neste evento.");
      }

      const client = await prisma.client.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return response.status(201).send({ clientId: client.id });
    }
  );
}
