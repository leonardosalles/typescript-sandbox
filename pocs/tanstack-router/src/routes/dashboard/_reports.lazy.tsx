import { Route } from "./reports";
import type { DashboardStats } from "@/lib/api";

export function ReportsPage() {
  const { stats } = Route.useLoaderData() as { stats: DashboardStats };

  const metrics = [
    { label: "Users", value: stats.totalUsers, max: 20, color: "#6366f1" },
    { label: "Active", value: stats.activeUsers, max: 20, color: "#22c55e" },
    { label: "Posts", value: stats.totalPosts, max: 15, color: "#f59e0b" },
    {
      label: "Published",
      value: stats.publishedPosts,
      max: 15,
      color: "#06b6d4",
    },
  ];

  const monthlyData = [
    { month: "Aug", users: 3, posts: 2, views: 1200 },
    { month: "Sep", users: 5, posts: 4, views: 3400 },
    { month: "Oct", users: 4, posts: 3, views: 2800 },
    { month: "Nov", users: 7, posts: 6, views: 5100 },
    { month: "Dec", users: 6, posts: 5, views: 4600 },
    { month: "Jan", users: 9, posts: 8, views: 7200 },
    { month: "Feb", users: 11, posts: 7, views: 8900 },
    {
      month: "Mar",
      users: 12,
      posts: stats.totalPosts,
      views: stats.totalViews / 10,
    },
  ];

  const maxViews = Math.max(...monthlyData.map((d) => d.views));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="page-subtitle">
            This page is <strong>code-split</strong> — loaded on demand via{" "}
            <code>lazyRouteComponent</code>
          </p>
        </div>
        <div className="lazy-badge">⚡ Lazy Loaded</div>
      </div>

      <div className="debug-panel">
        <strong>Code splitting:</strong> This component lives in{" "}
        <code>_reports.lazy.tsx</code> — a separate Vite chunk. The loader in{" "}
        <code>reports.tsx</code> and this component's download happen{" "}
        <strong>in parallel</strong>.
      </div>

      <div className="report-section">
        <h2>Current Metrics</h2>
        <div className="metric-bars">
          {metrics.map((m) => (
            <div key={m.label} className="metric-bar-wrap">
              <div className="metric-bar-label">
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
              <div className="metric-bar-track">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${(m.value / m.max) * 100}%`,
                    background: m.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>Monthly Growth</h2>
        <div className="chart-wrap">
          <svg viewBox="0 0 700 280" className="bar-chart">
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <line
                key={pct}
                x1="60"
                y1={240 - pct * 200}
                x2="680"
                y2={240 - pct * 200}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            {monthlyData.map((d, i) => {
              const x = 60 + i * 80;
              const barWidth = 28;
              const height = (d.views / maxViews) * 200;
              return (
                <g key={d.month}>
                  <rect
                    x={x}
                    y={240 - height}
                    width={barWidth}
                    height={height}
                    fill="#6366f1"
                    opacity="0.85"
                    rx="3"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={255}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--text-muted)"
                  >
                    {d.month}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={240 - height - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--text-muted)"
                  >
                    {d.users}u
                  </text>
                </g>
              );
            })}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <text
                key={pct}
                x="55"
                y={244 - pct * 200}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
              >
                {Math.round((pct * maxViews) / 1000)}k
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="report-section">
        <h2>Monthly Breakdown</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>New Users</th>
                <th>New Posts</th>
                <th>Views</th>
                <th>Views/Post</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((d) => (
                <tr key={d.month}>
                  <td>
                    <strong>{d.month}</strong>
                  </td>
                  <td>{d.users}</td>
                  <td>{d.posts}</td>
                  <td>{d.views.toLocaleString()}</td>
                  <td>
                    {d.posts > 0
                      ? Math.round(d.views / d.posts).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
