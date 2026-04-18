import { Elysia, t } from "elysia";
import { generateServers, generateAlerts, generateSummary } from "./mock-data";

export const serversPlugin = new Elysia({ prefix: "/servers" })
  .get("/", () => {
    const servers = generateServers();
    return {
      data: servers,
      meta: {
        total: servers.length,
        timestamp: new Date().toISOString(),
      },
    };
  })
  .get(
    "/:id",
    ({ params }) => {
      const servers = generateServers();
      const server = servers.find((s) => s.id === params.id);

      return { data: server };
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    },
  )
  .get(
    "/region/:region",
    ({ params }) => {
      const servers = generateServers().filter(
        (s) => s.region === params.region,
      );
      return {
        data: servers,
        meta: {
          total: servers.length,
          region: params.region,
          timestamp: new Date().toISOString(),
        },
      };
    },
    {
      params: t.Object({
        region: t.String(),
      }),
    },
  );

export const alertsPlugin = new Elysia({ prefix: "/alerts" })
  .get("/", ({ query }) => {
    let alerts = generateAlerts();

    if (query.resolved !== undefined) {
      const isResolved = query.resolved === "true";
      alerts = alerts.filter((a) => a.resolved === isResolved);
    }

    if (query.severity) {
      alerts = alerts.filter((a) => a.severity === query.severity);
    }

    return {
      data: alerts,
      meta: {
        total: alerts.length,
        timestamp: new Date().toISOString(),
      },
    };
  })
  .get(
    "/",
    ({ query }) => {
      let alerts = generateAlerts();
      if (query.resolved !== undefined) {
        const isResolved = query.resolved === "true";
        alerts = alerts.filter((a) => a.resolved === isResolved);
      }
      return { data: alerts };
    },
    {
      query: t.Object({
        resolved: t.Optional(t.String()),
        severity: t.Optional(t.String()),
      }),
    },
  );

export const summaryPlugin = new Elysia({ prefix: "/summary" }).get("/", () => {
  const servers = generateServers();
  const summary = generateSummary(servers);
  return {
    data: summary,
    timestamp: new Date().toISOString(),
  };
});
