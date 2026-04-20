import type { DashboardSummary } from "../types";

interface Props {
  summary: DashboardSummary;
  lastUpdated: string | null;
}

export function SummaryBar({ summary, lastUpdated }: Props) {
  const updated = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : "--:--:--";

  return (
    <div className="summary-bar">
      <div className="summary-cards">
        <SummaryCard
          value={summary.totalServers}
          label="Total Servers"
          accent="#a78bfa"
        />
        <SummaryCard
          value={summary.healthyServers}
          label="Healthy"
          accent="#00ff9d"
        />
        <SummaryCard
          value={summary.warningServers}
          label="Warning"
          accent="#ffb800"
        />
        <SummaryCard
          value={summary.criticalServers}
          label="Critical"
          accent="#ff3d6b"
        />
        <SummaryCard
          value={summary.offlineServers}
          label="Offline"
          accent="#5a5a72"
        />
        <SummaryCard
          value={summary.activeAlerts}
          label="Active Alerts"
          accent="#f472b6"
        />
        <SummaryCard
          value={`${summary.avgCpuUsage}%`}
          label="Avg CPU"
          accent={
            summary.avgCpuUsage > 80
              ? "#ff3d6b"
              : summary.avgCpuUsage > 60
                ? "#ffb800"
                : "#00ff9d"
          }
        />
        <SummaryCard
          value={`${summary.avgMemoryUsage}%`}
          label="Avg Memory"
          accent={
            summary.avgMemoryUsage > 85
              ? "#ff3d6b"
              : summary.avgMemoryUsage > 70
                ? "#ffb800"
                : "#00ff9d"
          }
        />
      </div>
      <div className="summary-updated">
        Last refresh: <span>{updated}</span>
      </div>
    </div>
  );
}

function SummaryCard({
  value,
  label,
  accent,
}: {
  value: number | string;
  label: string;
  accent: string;
}) {
  return (
    <div className="summary-card" style={{ borderTopColor: accent }}>
      <span className="summary-value" style={{ color: accent }}>
        {value}
      </span>
      <span className="summary-label">{label}</span>
    </div>
  );
}
