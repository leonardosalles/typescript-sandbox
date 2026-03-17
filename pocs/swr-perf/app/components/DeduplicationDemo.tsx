"use client";

import useSWR from "swr";
import { useState, useCallback, useEffect } from "react";
import { swrFetcher, manualFetcher } from "../lib/fetcher";

function SWRConsumer({ index }: { index: number }) {
  const { data: postsData, isLoading } = useSWR("/api/posts", swrFetcher);
  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded text-xs mono"
      style={{
        background: "var(--surface2)",
        borderLeft: "2px solid var(--green)",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>consumer[{index}]</span>
      {isLoading ? (
        <span style={{ color: "var(--yellow)" }}>loading…</span>
      ) : (
        <span style={{ color: "var(--green)" }}>
          ✓ {(postsData as any)?.meta?.count ?? 0} posts
        </span>
      )}
    </div>
  );
}

function ManualConsumer({ index }: { index: number }) {
  const [status, setStatus] = useState<"loading" | "done">("loading");
  const [count, setCount] = useState(0);

  useEffect(() => {
    manualFetcher<{ meta: { count: number } }>("/api/posts").then((d) => {
      setCount(d.meta?.count ?? 0);
      setStatus("done");
    });
  }, []);

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded text-xs mono"
      style={{
        background: "var(--surface2)",
        borderLeft: "2px solid var(--red)",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>consumer[{index}]</span>
      {status === "loading" ? (
        <span style={{ color: "var(--yellow)" }}>loading… (own request)</span>
      ) : (
        <span style={{ color: "var(--red)" }}>✓ {count} posts</span>
      )}
    </div>
  );
}

export function DeduplicationDemo() {
  const [swrCount, setSwrCount] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [swrKey, setSwrKey] = useState(0);
  const [manualKey, setManualKey] = useState(0);

  const mountSWR = useCallback(() => {
    setSwrKey((k) => k + 1);
  }, []);
  const mountManual = useCallback(() => {
    setManualKey((k) => k + 1);
  }, []);

  return (
    <div className="metric-card p-5 flex flex-col gap-4">
      <div>
        <h2
          className="font-bold text-sm mb-1"
          style={{ color: "var(--text)", letterSpacing: "0.05em" }}
        >
          DEDUPLICATION DEMO
        </h2>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Mount multiple consumers with the same URL. Check the Network tab.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-xs mono px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,255,136,0.1)",
              color: "var(--green)",
              border: "1px solid rgba(0,255,136,0.2)",
            }}
          >
            SWR
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            1 request regardless of count
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={8}
            value={swrCount}
            onChange={(e) => setSwrCount(Number(e.target.value))}
            className="flex-1"
          />
          <span className="mono text-xs w-4" style={{ color: "var(--text)" }}>
            {swrCount}
          </span>
          <button
            onClick={mountSWR}
            className="text-xs px-3 py-1 rounded"
            style={{
              background: "rgba(0,255,136,0.1)",
              color: "var(--green)",
              border: "1px solid rgba(0,255,136,0.2)",
            }}
          >
            Mount
          </button>
        </div>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
          {swrKey > 0 &&
            [...Array(swrCount)].map((_, i) => (
              <SWRConsumer key={`${swrKey}-${i}`} index={i} />
            ))}
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--border)" }} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-xs mono px-2 py-0.5 rounded"
            style={{
              background: "rgba(255,64,96,0.1)",
              color: "var(--red)",
              border: "1px solid rgba(255,64,96,0.2)",
            }}
          >
            MANUAL
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            N consumers = N requests
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={8}
            value={manualCount}
            onChange={(e) => setManualCount(Number(e.target.value))}
            className="flex-1"
          />
          <span className="mono text-xs w-4" style={{ color: "var(--text)" }}>
            {manualCount}
          </span>
          <button
            onClick={mountManual}
            className="text-xs px-3 py-1 rounded"
            style={{
              background: "rgba(255,64,96,0.1)",
              color: "var(--red)",
              border: "1px solid rgba(255,64,96,0.2)",
            }}
          >
            Mount
          </button>
        </div>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
          {manualKey > 0 &&
            [...Array(manualCount)].map((_, i) => (
              <ManualConsumer key={`${manualKey}-${i}`} index={i} />
            ))}
        </div>
      </div>
    </div>
  );
}
