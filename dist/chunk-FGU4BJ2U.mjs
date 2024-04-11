import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/getEventClients.ts
import z from "zod";
async function getEventClients(app) {
  app.withTypeProvider().get(
    "/events/:eventId/clients",
    {
      schema: {
        summary: "show events from clients",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullable(),
          pageIndex: z.string().nullable().default("0").transform(Number)
        }),
        response: {
          200: z.object({
            clients: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date().nullable()
              })
            )
          })
        }
      }
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
              createdAt: true
            }
          }
        },
        where: query ? {
          eventId,
          name: {
            contains: query
          }
        } : {
          eventId
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: "desc"
        }
      });
      return response.send({
        clients: clients.map((clients2) => {
          return {
            id: clients2.id,
            name: clients2.name,
            email: clients2.email,
            createdAt: clients2.createdAt,
            checkedInAt: clients2.CheckIn?.createdAt ?? null
          };
        })
      });
    }
  );
}

export {
  getEventClients
};
