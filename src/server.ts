import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { CreateEvent } from "./routes/createEvents";
import { registerFromEvents } from "./routes/registerFromEvents.1";
import { getEvent } from "./routes/get.event";
import { getClientBadge } from "./routes/getClientBadge";
import { checkIn } from "./routes/checkIn";
import { getEventClients } from "./routes/getEventClients";
import fastifySwagger from "@fastify/swagger";
import { transformer } from "zod";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./utils/errorHandler";

const app = fastify();

app.register(fastifySwagger, {
  swagger: {
    consumes: ["applicarion/json"],
    produces: ["applicarion/json"],
    info: {
      title: "pass-in",
      description:
        "Especificações da API pass-in construida durante a Nlw Unite",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
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

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
