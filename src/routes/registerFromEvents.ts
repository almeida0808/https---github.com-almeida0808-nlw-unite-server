import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { error } from "console";

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

      const [event, amountOfClientsForEvents] = await Promise.all([
        // event = pega todos os dados da tabela de eventos
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),

        // amountOfClientsForEvents = acessa a tabela de clientes e conta quantos clientes estão inscritos no mesmo evento, ele filtra isso pelo eventID
        prisma.client.count({
          where: {
            eventId,
          },
        }),
      ]);

      if (
        event?.maximumClients &&
        amountOfClientsForEvents >= event.maximumClients
      ) {
        throw new Error("Desculpe, as vagas para esse evento se esgotaram.");
      }
      const client = await prisma.client.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return response.status(201).send({
        clientId: client.id,
      });
    }
  );
}
