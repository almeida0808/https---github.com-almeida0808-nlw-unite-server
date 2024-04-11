import {
  BadRequest
} from "./chunk-OH33D4AI.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/checkIn.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get(
    "/clients/:clientId/check-in",
    {
      schema: {
        summary: "Check In events",
        tags: ["check-ins"],
        params: z.object({
          clientId: z.coerce.number().int()
        })
      }
    },
    async (request, response) => {
      const { clientId } = request.params;
      const clientsCheckIn = await prisma.checkIn.findUnique({
        where: {
          clientId
        }
      });
      if (clientsCheckIn !== null) {
        throw new BadRequest("Este usu\xE1rio j\xE1 realizou o check-in.");
      }
      await prisma.checkIn.create({
        data: {
          clientId
        }
      });
      return response.status(201).send();
    }
  );
}

export {
  checkIn
};
