import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { serversPlugin, alertsPlugin, summaryPlugin } from "./routes";

const PORT = 3001;

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Server Monitor API",
          version: "1.0.0",
          description: "POC — ElysiaJS",
        },
      },
    }),
  )
  .get("/health", () => ({
    status: "ok",
    runtime: "bun",
    version: Bun.version,
    timestamp: new Date().toISOString(),
  }))
  .group("/api/v1", (app) =>
    app.use(serversPlugin).use(alertsPlugin).use(summaryPlugin),
  )
  .onError(({ code, error, set }) => {
    console.error(`[Error] ${code}:`, error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Route not found", code };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return { error: "Validation failed", details: error.message, code };
    }

    set.status = 500;
    return { error: "Internal server error", code };
  })
  .onRequest(({ request }) => {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] ${request.method} ${new URL(request.url).pathname}`);
  })
  .listen(PORT);

console.log(`
╔══════════════════════════════════════╗
║   🚀 Server Monitor API             ║
║   Runtime: Bun ${Bun.version.padEnd(19)}║
║   Porta: ${String(PORT).padEnd(27)}║
╚══════════════════════════════════════╝

Endpoints disponíveis:
  GET  /health
  GET  /api/v1/summary
  GET  /api/v1/servers
  GET  /api/v1/servers/:id
  GET  /api/v1/servers/region/:region
  GET  /api/v1/alerts
  GET  /swagger  (Swagger UI)
`);

export type App = typeof app;
