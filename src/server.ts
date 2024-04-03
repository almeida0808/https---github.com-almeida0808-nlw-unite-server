import fastify from "fastify";
import { z } from "zod";
const app = fastify();

app.post("/events", (request, response) => {
  console.log(request.body);
  
   "oi mundo";
});

const PORT = 4444;

app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on Port ${PORT}`);
});
