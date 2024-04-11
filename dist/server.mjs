import {
  errorHandler
} from "./chunk-TFBNGZEI.mjs";
import {
  checkIn
} from "./chunk-IKN74JBZ.mjs";
import {
  CreateEvent
} from "./chunk-4RRC5PJ3.mjs";
import "./chunk-3MXUBCIK.mjs";
import {
  getEvent
} from "./chunk-F7CECJ22.mjs";
import {
  getClientBadge
} from "./chunk-4BET5WJR.mjs";
import {
  getEventClients
} from "./chunk-FGU4BJ2U.mjs";
import {
  registerFromEvents
} from "./chunk-YZ5GT7UW.mjs";
import "./chunk-OH33D4AI.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
var app = fastify();
app.register(fastifySwagger, {
  swagger: {
    consumes: ["applicarion/json"],
    produces: ["applicarion/json"],
    info: {
      title: "pass-in",
      description: "Especifica\xE7\xF5es da API pass-in construida durante a Nlw Unite",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(CreateEvent);
app.register(registerFromEvents);
app.register(getEvent);
app.register(getClientBadge);
app.register(checkIn);
app.register(getEventClients);
app.setErrorHandler(errorHandler);
var PORT = 4444;
app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
