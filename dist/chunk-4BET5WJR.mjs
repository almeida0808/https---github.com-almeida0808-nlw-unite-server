import {
  BadRequest
} from "./chunk-OH33D4AI.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/getClientBadge.ts
import { z } from "zod";
async function getClientBadge(app) {
  app.withTypeProvider().get(
    "/clients/:clientId/badge",
    {
      schema: {
        summary: "get badge clients",
        tags: ["clients"],
        params: z.object({
          clientId: z.string().transform(Number)
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              id: z.number().int(),
              eventTitle: z.string(),
              checkInURL: z.string().url()
            })
          })
        }
      }
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
              title: true
            }
          }
        },
        where: {
          id: clientId
        }
      });
      if (client === null) {
        throw new BadRequest("Esse usu\xE1rio n\xE3o existe.");
      }
      const baseURL = `${request.protocol}://${request.hostname}`;
      console.log(baseURL);
      const checkInURL = new URL(`/clients/${client.id}/check-in`, baseURL);
      return response.send({
        badge: {
          name: client?.name,
          email: client?.email,
          id: client?.id,
          eventTitle: client.event.title,
          checkInURL: checkInURL.toString()
        }
      });
    }
  );
}

export {
  getClientBadge
};
