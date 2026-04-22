import type { Server, Alert, DashboardSummary } from "./types";

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const randInt = (min: number, max: number): number =>
  Math.floor(rand(min, max));

const GB = 1024 * 1024 * 1024;

const fluctuate = (base: number, variance: number): number => {
  const delta = (Math.random() - 0.5) * 2 * variance;
  return Math.max(0, Math.min(100, base + delta));
};

const SERVER_CONFIGS = [
  {
    id: "srv-001",
    name: "api-gateway-prod",
    hostname: "api-gw-01.internal",
    region: "us-east-1",
    environment: "production" as const,
    baseStatus: "healthy" as const,
    baseCpu: 35,
    baseMemory: 62,
    cores: 8,
    cpuModel: "Intel Xeon E5-2680 v4",
    tags: ["gateway", "critical", "load-balanced"],
  },
  {
    id: "srv-002",
    name: "db-primary-prod",
    hostname: "db-primary-01.internal",
    region: "us-east-1",
    environment: "production" as const,
    baseStatus: "warning" as const,
    baseCpu: 78,
    baseMemory: 85,
    cores: 16,
    cpuModel: "AMD EPYC 7742",
    tags: ["database", "primary", "postgresql"],
  },
  {
    id: "srv-003",
    name: "worker-queue-01",
    hostname: "worker-01.internal",
    region: "us-west-2",
    environment: "production" as const,
    baseStatus: "healthy" as const,
    baseCpu: 45,
    baseMemory: 55,
    cores: 4,
    cpuModel: "Intel Xeon E5-2650",
    tags: ["worker", "queue", "redis"],
  },
  {
    id: "srv-004",
    name: "cdn-edge-eu",
    hostname: "cdn-eu-01.internal",
    region: "eu-west-1",
    environment: "production" as const,
    baseStatus: "healthy" as const,
    baseCpu: 22,
    baseMemory: 40,
    cores: 4,
    cpuModel: "Intel Xeon E5-2620",
    tags: ["cdn", "edge", "nginx"],
  },
  {
    id: "srv-005",
    name: "analytics-engine",
    hostname: "analytics-01.internal",
    region: "us-east-1",
    environment: "staging" as const,
    baseStatus: "critical" as const,
    baseCpu: 92,
    baseMemory: 90,
    cores: 32,
    cpuModel: "AMD EPYC 7763",
    tags: ["analytics", "spark", "high-memory"],
  },
  {
    id: "srv-006",
    name: "monitoring-stack",
    hostname: "monitoring-01.internal",
    region: "us-east-1",
    environment: "production" as const,
    baseStatus: "healthy" as const,
    baseCpu: 28,
    baseMemory: 45,
    cores: 4,
    cpuModel: "Intel Xeon E5-2650",
    tags: ["monitoring", "prometheus", "grafana"],
  },
  {
    id: "srv-007",
    name: "dev-sandbox-01",
    hostname: "dev-01.internal",
    region: "us-west-2",
    environment: "development" as const,
    baseStatus: "offline" as const,
    baseCpu: 0,
    baseMemory: 0,
    cores: 2,
    cpuModel: "Intel Xeon E5-2620",
    tags: ["development", "sandbox"],
  },
  {
    id: "srv-008",
    name: "auth-service-prod",
    hostname: "auth-01.internal",
    region: "eu-central-1",
    environment: "production" as const,
    baseStatus: "healthy" as const,
    baseCpu: 18,
    baseMemory: 30,
    cores: 4,
    cpuModel: "Intel Xeon E5-2620",
    tags: ["auth", "jwt", "oauth"],
  },
];

export function generateServers(): Server[] {
  return SERVER_CONFIGS.map((cfg) => {
    const isOffline = cfg.baseStatus === "offline";
    const cpuUsage = isOffline ? 0 : fluctuate(cfg.baseCpu, 8);
    const memUsage = isOffline ? 0 : fluctuate(cfg.baseMemory, 5);
    const totalMem = 16 * GB;

    let status = cfg.baseStatus;
    if (!isOffline) {
      if (cpuUsage > 90 || memUsage > 90) status = "critical";
      else if (cpuUsage > 70 || memUsage > 75) status = "warning";
      else status = "healthy";
    }

    return {
      id: cfg.id,
      name: cfg.name,
      hostname: cfg.hostname,
      region: cfg.region,
      environment: cfg.environment,
      status,
      uptime: isOffline ? 0 : randInt(86400, 86400 * 180),
      lastSeen: isOffline
        ? new Date(Date.now() - 1000 * 60 * 30).toISOString()
        : new Date().toISOString(),
      cpu: {
        usage: Math.round(cpuUsage * 10) / 10,
        cores: cfg.cores,
        model: cfg.cpuModel,
        temperature: isOffline ? 0 : Math.round(fluctuate(55, 10)),
      },
      memory: {
        total: totalMem,
        used: Math.floor((memUsage / 100) * totalMem),
        free: Math.floor(((100 - memUsage) / 100) * totalMem),
        usagePercent: Math.round(memUsage * 10) / 10,
      },
      disk: {
        total: 500 * GB,
        used: Math.floor(rand(0.3, 0.8) * 500 * GB),
        free: Math.floor(rand(0.2, 0.7) * 500 * GB),
        usagePercent: Math.round(rand(30, 80)),
        mountPoint: "/",
      },
      network: {
        bytesIn: Math.floor(rand(1e6, 1e9)),
        bytesOut: Math.floor(rand(5e5, 5e8)),
        packetsIn: Math.floor(rand(1000, 100000)),
        packetsOut: Math.floor(rand(800, 80000)),
        interface: "eth0",
      },
      tags: cfg.tags,
    };
  });
}

const STATIC_ALERTS: Alert[] = [
  {
    id: "alert-001",
    serverId: "srv-002",
    serverName: "db-primary-prod",
    severity: "warning",
    message: "Memory usage above 80% for the last 15 minutes",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    resolved: false,
  },
  {
    id: "alert-002",
    serverId: "srv-005",
    serverName: "analytics-engine",
    severity: "critical",
    message: "CPU usage critical: 92.3% — potential OOM risk",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    resolved: false,
  },
  {
    id: "alert-003",
    serverId: "srv-007",
    serverName: "dev-sandbox-01",
    severity: "info",
    message: "Server went offline — scheduled maintenance window",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    resolved: false,
  },
  {
    id: "alert-004",
    serverId: "srv-001",
    serverName: "api-gateway-prod",
    severity: "info",
    message: "Deployment completed successfully — v2.4.1",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    resolved: true,
  },
  {
    id: "alert-005",
    serverId: "srv-003",
    serverName: "worker-queue-01",
    severity: "warning",
    message: "Queue backlog growing: 12,450 pending jobs",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    resolved: false,
  },
];

export function generateAlerts(): Alert[] {
  return STATIC_ALERTS;
}

export function generateSummary(servers: Server[]): DashboardSummary {
  const activeAlerts = STATIC_ALERTS.filter((a) => !a.resolved).length;
  const avgCpu =
    servers
      .filter((s) => s.status !== "offline")
      .reduce((sum, s) => sum + s.cpu.usage, 0) /
    servers.filter((s) => s.status !== "offline").length;

  const avgMem =
    servers
      .filter((s) => s.status !== "offline")
      .reduce((sum, s) => sum + s.memory.usagePercent, 0) /
    servers.filter((s) => s.status !== "offline").length;

  return {
    totalServers: servers.length,
    healthyServers: servers.filter((s) => s.status === "healthy").length,
    warningServers: servers.filter((s) => s.status === "warning").length,
    criticalServers: servers.filter((s) => s.status === "critical").length,
    offlineServers: servers.filter((s) => s.status === "offline").length,
    activeAlerts,
    avgCpuUsage: Math.round(avgCpu * 10) / 10,
    avgMemoryUsage: Math.round(avgMem * 10) / 10,
  };
}
