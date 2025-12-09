import fastify from "fastify";
import cors from "@fastify/cors";

const app = fastify({ logger: true });
app.register(cors, { origin: true });

app.post("/login", async (req, reply) => {
  const body = req.body as { username?: string };
  const user = body?.username ?? "leonardo";

  if (!["leonardo", "heitor"].includes(user)) {
    return reply.status(400).send({ error: "Invalid user" });
  }

  return {
    jid: `${user}@localhost`,
    password: "123456",
    service: "ws://localhost:5280/xmpp-websocket",
  };
});

app.listen({ port: 3333, host: "0.0.0.0" });
