export type ServerStatus = "healthy" | "warning" | "critical" | "offline";

export type AlertSeverity = "info" | "warning" | "critical";

export interface CpuMetric {
  usage: number;
  cores: number;
  model: string;
  temperature: number;
}

export interface MemoryMetric {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
}

export interface DiskMetric {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  mountPoint: string;
}

export interface NetworkMetric {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  interface: string;
}

export interface Server {
  id: string;
  name: string;
  hostname: string;
  region: string;
  environment: "production" | "staging" | "development";
  status: ServerStatus;
  uptime: number;
  lastSeen: string;
  cpu: CpuMetric;
  memory: MemoryMetric;
  disk: DiskMetric;
  network: NetworkMetric;
  tags: string[];
}

export interface Alert {
  id: string;
  serverId: string;
  serverName: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface DashboardSummary {
  totalServers: number;
  healthyServers: number;
  warningServers: number;
  criticalServers: number;
  offlineServers: number;
  activeAlerts: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
}
