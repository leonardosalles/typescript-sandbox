"use client";

import useSWR from "swr";
import { useRef, useState } from "react";
import { swrFetcher } from "../lib/fetcher";
import { perfMark } from "../lib/perf";

interface Post {
  id: number;
  title: string;
  body: string;
}
interface ApiResponse {
  posts: Post[];
  meta: {
    duration: number;
    count: number;
    strategy: string;
    timestamp: number;
  };
}

export function SWRPanel() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [refreshInterval, setRefreshInterval] = useState(0);
  const [fetchLog, setFetchLog] = useState<string[]>([]);
  const mountTime = useRef(Date.now());

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse>(
    "/api/posts",
    swrFetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
      onSuccess: (data) => {
        const elapsed = Date.now() - mountTime.current;
        setFetchLog((prev) => [
          `+${elapsed}ms — network ${data.meta.duration}ms — ${new Date().toLocaleTimeString()}`,
          ...prev.slice(0, 9),
        ]);
        perfMark("swr-data-ready");
      },
    },
  );

  const handleManualRefetch = () => {
    perfMark("swr-manual-refetch");
    mutate();
  };

  return (
    <div className="metric-card p-5 glow-green flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--text)" }}
          >
            stale-while-revalidate
          </span>
        </div>
        <div
          className="flex items-center gap-2 mono text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {isValidating && (
            <span
              className="animate-pulse-dot inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--green)" }}
            />
          )}
          <span>
            renders:{" "}
            <span style={{ color: "var(--green)" }}>
              {renderCountRef.current}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs mono">
        <StatusBadge
          loading={isLoading}
          validating={isValidating}
          error={!!error}
        />
        {data && (
          <span style={{ color: "var(--text-muted)" }}>
            server:{" "}
            <span style={{ color: "var(--yellow)" }}>
              {data.meta.duration}ms
            </span>
          </span>
        )}
        {data && (
          <span style={{ color: "var(--text-muted)" }}>
            items:{" "}
            <span style={{ color: "var(--text)" }}>{data.meta.count}</span>
          </span>
        )}
      </div>

      <div
        className="terminal p-3 text-xs leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        <span style={{ color: "var(--green)" }}>// SWR cache key: </span>
        <span style={{ color: "var(--blue)" }}>&quot;/api/posts&quot;</span>
        <br />
        <span style={{ color: "var(--green)" }}>// dedupingInterval: </span>
        <span style={{ color: "var(--yellow)" }}>2000ms</span>
        <span style={{ color: "var(--green)" }}>
          {" "}
          — multiple consumers share one request
        </span>
        <br />
        <span style={{ color: "var(--green)" }}>// revalidateOnFocus: </span>
        <span style={{ color: "var(--yellow)" }}>true</span>
        <span style={{ color: "var(--green)" }}>
          {" "}
          — refetches when tab regains focus
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleManualRefetch}
          className="text-xs px-3 py-1.5 rounded font-medium transition-all"
          style={{
            background: "rgba(0,255,136,0.1)",
            color: "var(--green)",
            border: "1px solid rgba(0,255,136,0.25)",
          }}
        >
          ↻ Refetch (mutate)
        </button>
        <select
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="text-xs px-2 py-1.5 rounded"
          style={{
            background: "var(--surface2)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <option value={0}>No polling</option>
          <option value={2000}>Poll 2s</option>
          <option value={5000}>Poll 5s</option>
        </select>
      </div>

      <PostList posts={data?.posts} loading={isLoading} />

      <div>
        <p className="text-xs mono mb-1" style={{ color: "var(--text-muted)" }}>
          network log
        </p>
        <div className="terminal p-2 max-h-28 overflow-y-auto">
          {fetchLog.length === 0 && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              waiting for first fetch...
            </p>
          )}
          {fetchLog.map((entry, i) => (
            <p
              key={i}
              className="text-xs"
              style={{ color: i === 0 ? "var(--green)" : "var(--text-muted)" }}
            >
              {entry}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  loading,
  validating,
  error,
}: {
  loading: boolean;
  validating: boolean;
  error: boolean;
}) {
  if (error)
    return (
      <span
        className="px-2 py-0.5 rounded text-xs"
        style={{
          background: "rgba(255,64,96,0.1)",
          color: "var(--red)",
          border: "1px solid rgba(255,64,96,0.2)",
        }}
      >
        error
      </span>
    );
  if (loading)
    return (
      <span
        className="px-2 py-0.5 rounded text-xs animate-pulse"
        style={{
          background: "rgba(255,215,0,0.1)",
          color: "var(--yellow)",
          border: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        loading
      </span>
    );
  if (validating)
    return (
      <span
        className="px-2 py-0.5 rounded text-xs"
        style={{
          background: "rgba(64,128,255,0.1)",
          color: "var(--blue)",
          border: "1px solid rgba(64,128,255,0.2)",
        }}
      >
        revalidating
      </span>
    );
  return (
    <span
      className="px-2 py-0.5 rounded text-xs"
      style={{
        background: "rgba(0,255,136,0.1)",
        color: "var(--green)",
        border: "1px solid rgba(0,255,136,0.2)",
      }}
    >
      cached
    </span>
  );
}

function PostList({ posts, loading }: { posts?: Post[]; loading?: boolean }) {
  if (loading)
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded animate-pulse"
            style={{ background: "var(--surface2)" }}
          />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
      {(posts ?? []).map((post) => (
        <div
          key={post.id}
          className="animate-slide-in p-3 rounded text-xs"
          style={{
            background: "var(--surface2)",
            borderLeft: "2px solid var(--green)",
          }}
        >
          <p
            className="font-medium text-xs mb-0.5 truncate"
            style={{ color: "var(--text)" }}
          >
            {post.title}
          </p>
          <p
            className="text-xs line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {post.body}
          </p>
        </div>
      ))}
    </div>
  );
}
