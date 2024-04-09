import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { CreateEvent } from "./routes/createEvents";
import { registerFromEvents } from "./routes/registerFromEvents";
import { getEvent } from "./routes/get.event";
import { getClientBadge } from "./routes/getClientBadge";
import { checkIn } from "./routes/checkIn";
import { getEventClients } from "./routes/getEventClients";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(CreateEvent);
app.register(registerFromEvents);
app.register(getEvent);
app.register(getClientBadge);
app.register(checkIn);
app.register(getEventClients);

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
