import { FastifyInstance } from "fastify";
import { BadRequest } from "../routes/_errors/badRequest";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, response) => {
  if (error instanceof BadRequest) {
    return response.status(400).send({ message: error.message });
  }
  return response.status(500).send({
    message: "Um erro aconteceu",
  });
};
