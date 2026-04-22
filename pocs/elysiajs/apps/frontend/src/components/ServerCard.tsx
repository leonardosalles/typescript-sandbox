import type { Server } from "../types";
import { MiniGauge } from "./MiniGauge";
import {
  statusConfig,
  formatUptime,
  formatRelativeTime,
} from "../utils/format";

interface Props {
  server: Server;
  selected: boolean;
  onClick: () => void;
}

export function ServerCard({ server, selected, onClick }: Props) {
  const cfg = statusConfig[server.status];

  return (
    <div
      className={`server-card ${selected ? "server-card--selected" : ""}`}
      style={{
        borderLeftColor: cfg.color,
        background: selected ? cfg.bg : undefined,
      }}
      onClick={onClick}
    >
      <div className="server-card-header">
        <div className="server-card-title-row">
          <span className="server-status-dot" style={{ background: cfg.dot }} />
          <span className="server-name">{server.name}</span>
        </div>
        <span
          className="server-status-badge"
          style={{ color: cfg.color, borderColor: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      <div className="server-meta">
        <span className="server-hostname">{server.hostname}</span>
        <span className="server-region">{server.region}</span>
      </div>

      {server.status !== "offline" && (
        <div className="server-gauges">
          <MiniGauge value={server.cpu.usage} label="CPU" />
          <MiniGauge value={server.memory.usagePercent} label="MEM" />
          <MiniGauge value={server.disk.usagePercent} label="DISK" />
        </div>
      )}

      {server.status === "offline" && (
        <div className="server-offline-msg">
          Server offline — last seen {formatRelativeTime(server.lastSeen)}
        </div>
      )}

      <div className="server-footer">
        <span className="server-uptime">↑ {formatUptime(server.uptime)}</span>
        <span
          className="server-env"
          style={{
            color:
              server.environment === "production"
                ? "#f472b6"
                : server.environment === "staging"
                  ? "#a78bfa"
                  : "#60a5fa",
          }}
        >
          {server.environment}
        </span>
      </div>

      <div className="server-tags">
        {server.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="server-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
