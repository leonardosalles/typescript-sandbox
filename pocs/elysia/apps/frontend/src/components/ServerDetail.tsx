import type { Server } from "../types";
import { MiniGauge } from "./MiniGauge";
import {
  statusConfig,
  formatBytes,
  formatUptime,
  formatRelativeTime,
} from "../utils/format";

interface Props {
  server: Server;
  onClose: () => void;
}

export function ServerDetail({ server, onClose }: Props) {
  const cfg = statusConfig[server.status];

  return (
    <div className="server-detail">
      <div className="detail-header">
        <div>
          <div className="detail-title-row">
            <span
              className="server-status-dot large"
              style={{ background: cfg.dot }}
            />
            <h2 className="detail-title">{server.name}</h2>
          </div>
          <p className="detail-hostname">{server.hostname}</p>
        </div>
        <button className="detail-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="detail-section">
        <div className="detail-grid-2">
          <DetailItem label="Status">
            <span style={{ color: cfg.color }}>{cfg.label}</span>
          </DetailItem>
          <DetailItem label="Environment">
            <span
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
          </DetailItem>
          <DetailItem label="Region">{server.region}</DetailItem>
          <DetailItem label="Uptime">{formatUptime(server.uptime)}</DetailItem>
          <DetailItem label="Last Seen">
            {formatRelativeTime(server.lastSeen)}
          </DetailItem>
          <DetailItem label="CPU Model" wide>
            {server.cpu.model}
          </DetailItem>
        </div>
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">CPU</h3>
        <div className="detail-grid-2">
          <DetailItem label="Cores">{server.cpu.cores}</DetailItem>
          <DetailItem label="Temperature">
            {server.cpu.temperature}°C
          </DetailItem>
        </div>
        <MiniGauge value={server.cpu.usage} label="Usage" />
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">Memory</h3>
        <div className="detail-grid-3">
          <DetailItem label="Total">
            {formatBytes(server.memory.total)}
          </DetailItem>
          <DetailItem label="Used">
            {formatBytes(server.memory.used)}
          </DetailItem>
          <DetailItem label="Free">
            {formatBytes(server.memory.free)}
          </DetailItem>
        </div>
        <MiniGauge value={server.memory.usagePercent} label="Usage" />
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">
          Disk ({server.disk.mountPoint})
        </h3>
        <div className="detail-grid-3">
          <DetailItem label="Total">
            {formatBytes(server.disk.total)}
          </DetailItem>
          <DetailItem label="Used">{formatBytes(server.disk.used)}</DetailItem>
          <DetailItem label="Free">{formatBytes(server.disk.free)}</DetailItem>
        </div>
        <MiniGauge value={server.disk.usagePercent} label="Usage" />
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">
          Network ({server.network.interface})
        </h3>
        <div className="detail-grid-2">
          <DetailItem label="In">
            {formatBytes(server.network.bytesIn)}
          </DetailItem>
          <DetailItem label="Out">
            {formatBytes(server.network.bytesOut)}
          </DetailItem>
          <DetailItem label="Packets In">
            {server.network.packetsIn.toLocaleString()}
          </DetailItem>
          <DetailItem label="Packets Out">
            {server.network.packetsOut.toLocaleString()}
          </DetailItem>
        </div>
      </div>

      <div className="detail-section">
        <h3 className="detail-section-title">Tags</h3>
        <div className="server-tags">
          {server.tags.map((tag) => (
            <span key={tag} className="server-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`detail-item ${wide ? "detail-item--wide" : ""}`}>
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{children}</span>
    </div>
  );
}
