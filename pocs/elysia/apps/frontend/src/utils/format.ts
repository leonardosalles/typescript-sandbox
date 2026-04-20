import type { ServerStatus, AlertSeverity } from "../types";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatUptime(seconds: number): string {
  if (seconds === 0) return "Offline";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const statusConfig: Record<
  ServerStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  healthy: {
    label: "Healthy",
    color: "#00ff9d",
    bg: "rgba(0,255,157,0.08)",
    dot: "#00ff9d",
  },
  warning: {
    label: "Warning",
    color: "#ffb800",
    bg: "rgba(255,184,0,0.08)",
    dot: "#ffb800",
  },
  critical: {
    label: "Critical",
    color: "#ff3d6b",
    bg: "rgba(255,61,107,0.08)",
    dot: "#ff3d6b",
  },
  offline: {
    label: "Offline",
    color: "#5a5a72",
    bg: "rgba(90,90,114,0.08)",
    dot: "#5a5a72",
  },
};

export const severityConfig: Record<
  AlertSeverity,
  { color: string; bg: string; icon: string }
> = {
  info: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", icon: "ℹ" },
  warning: { color: "#ffb800", bg: "rgba(255,184,0,0.08)", icon: "⚠" },
  critical: { color: "#ff3d6b", bg: "rgba(255,61,107,0.08)", icon: "✕" },
};
