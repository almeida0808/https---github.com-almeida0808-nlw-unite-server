import fastify from "fastify";
import { serializerCompiler,validatorCompiler } from "fastify-type-provider-zod";
import { CreateEvent } from "./routes/createEvents";
import { registerFromEvents } from "./routes/registerForEvents";
const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(CreateEvent)
app.register(registerFromEvents)

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
