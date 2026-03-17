"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { swrFetcher } from "../lib/fetcher";
import { getMetrics, clearMetrics, type FetchMetric } from "../lib/perf";

interface ServerMetrics {
  heapUsed: number;
  heapTotal: number;
  rss: number;
  uptime: number;
  timestamp: number;
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<FetchMetric[]>([]);

  const { data: serverMetrics } = useSWR<ServerMetrics>(
    "/api/metrics",
    swrFetcher,
    { refreshInterval: 3000 },
  );

  // Poll client metrics every second
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const swrMetrics = metrics.filter((m) => m.strategy === "swr");
  const manualMetrics = metrics.filter((m) => m.strategy === "manual");

  const avg = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const swrAvg = avg(swrMetrics.map((m) => m.duration));
  const manualAvg = avg(manualMetrics.map((m) => m.duration));
  const maxDuration = Math.max(swrAvg, manualAvg, 1);

  return (
    <div className="metric-card p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2
          className="font-bold text-sm"
          style={{ color: "var(--text)", letterSpacing: "0.05em" }}
        >
          PERFORMANCE DASHBOARD
        </h2>
        <button
          onClick={() => {
            clearMetrics();
            setMetrics([]);
          }}
          className="text-xs px-2 py-1 rounded mono"
          style={{
            background: "var(--surface2)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          clear
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <ComparisonBar
          label="SWR"
          value={swrAvg}
          max={maxDuration}
          count={swrMetrics.length}
          color="var(--green)"
        />
        <ComparisonBar
          label="MANUAL"
          value={manualAvg}
          max={maxDuration}
          count={manualMetrics.length}
          color="var(--red)"
        />
      </div>

      {swrAvg > 0 && manualAvg > 0 && (
        <div
          className="terminal p-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span style={{ color: "var(--purple)" }}>analysis: </span>
          {swrAvg < manualAvg ? (
            <span>
              SWR is{" "}
              <span style={{ color: "var(--green)" }}>
                {Math.round((manualAvg / swrAvg - 1) * 100)}% faster
              </span>{" "}
              on avg (cache hits bring this down over time)
            </span>
          ) : (
            <span>
              Manual is ahead — SWR cache hasn&apos;t warmed up yet. Keep
              refetching.
            </span>
          )}
        </div>
      )}

      {serverMetrics && (
        <div>
          <p
            className="text-xs mono mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            server memory (node.js)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <MemMetric
              label="heap used"
              value={serverMetrics.heapUsed}
              unit="MB"
            />
            <MemMetric
              label="heap total"
              value={serverMetrics.heapTotal}
              unit="MB"
            />
            <MemMetric label="rss" value={serverMetrics.rss} unit="MB" />
          </div>
        </div>
      )}

      <div>
        <p className="text-xs mono mb-2" style={{ color: "var(--text-muted)" }}>
          recent fetches ({metrics.length} total)
        </p>
        <div className="terminal p-2 max-h-36 overflow-y-auto flex flex-col gap-0.5">
          {metrics.length === 0 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              no fetches recorded yet
            </p>
          )}
          {[...metrics]
            .reverse()
            .slice(0, 15)
            .map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-xs mono">
                <span
                  className="w-14 text-right"
                  style={{
                    color: m.strategy === "swr" ? "var(--green)" : "var(--red)",
                  }}
                >
                  {m.strategy.toUpperCase()}
                </span>
                <span
                  className="w-16"
                  style={{
                    color:
                      m.duration < 200
                        ? "var(--green)"
                        : m.duration < 600
                          ? "var(--yellow)"
                          : "var(--red)",
                  }}
                >
                  {m.duration}ms
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                  {m.id}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  max,
  count,
  color,
}: {
  label: string;
  value: number;
  max: number;
  count: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex justify-between text-xs mono"
        style={{ color: "var(--text-muted)" }}
      >
        <span style={{ color }}>{label}</span>
        <span>{value > 0 ? `${value}ms avg · ${count} calls` : "no data"}</span>
      </div>
      <div
        className="h-5 rounded overflow-hidden"
        style={{ background: "var(--surface2)" }}
      >
        <div
          className="h-full rounded animate-bar flex items-center justify-end pr-2"
          style={{
            width: `${pct}%`,
            background: `${color}22`,
            border: `1px solid ${color}44`,
            minWidth: value > 0 ? "2px" : "0",
          }}
        >
          {pct > 20 && (
            <span className="text-xs mono" style={{ color, fontSize: "10px" }}>
              {pct}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MemMetric({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div
      className="p-2 rounded text-center"
      style={{ background: "var(--surface2)" }}
    >
      <p className="text-xs mono" style={{ color: "var(--purple)" }}>
        {value}
        <span style={{ color: "var(--text-muted)" }}>{unit}</span>
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "10px" }}>{label}</p>
    </div>
  );
}
