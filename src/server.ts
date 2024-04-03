import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { CreateEvent } from "./routes/createEvents";

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(CreateEvent);

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
