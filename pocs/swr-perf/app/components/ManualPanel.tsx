"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { manualFetcher } from "../lib/fetcher";
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

type FetchState = {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
};

export function ManualPanel() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [state, setState] = useState<FetchState>({
    data: null,
    loading: false,
    error: null,
  });
  const [fetchLog, setFetchLog] = useState<string[]>([]);
  const [useSlowEndpoint, setUseSlowEndpoint] = useState(false);
  const mountTime = useRef(Date.now());
  const requestIdRef = useRef(0);

  const endpoint = useSlowEndpoint ? "/api/slow-posts" : "/api/posts";

  const fetchData = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    const wallStart = performance.now();

    perfMark(`manual-fetch-start-${currentRequestId}`);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await manualFetcher<ApiResponse>(endpoint);

      // Race condition guard — discard stale responses
      if (currentRequestId !== requestIdRef.current) {
        console.warn(`[PERF] Discarding stale response #${currentRequestId}`);
        return;
      }

      const duration = Math.round(performance.now() - wallStart);
      const elapsed = Date.now() - mountTime.current;

      setFetchLog((prev) => [
        `+${elapsed}ms — network ${data.meta.duration}ms — total ${duration}ms — ${new Date().toLocaleTimeString()}`,
        ...prev.slice(0, 9),
      ]);

      setState({ data, loading: false, error: null });
      perfMark(`manual-fetch-end-${currentRequestId}`);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setState({ data: null, loading: false, error: String(err) });
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="metric-card p-5 glow-red flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--text)" }}
          >
            useEffect + fetch
          </span>
        </div>
        <div
          className="flex items-center gap-2 mono text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {state.loading && (
            <span
              className="animate-pulse-dot inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--red)" }}
            />
          )}
          <span>
            renders:{" "}
            <span style={{ color: "var(--red)" }}>
              {renderCountRef.current}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs mono">
        <ManualStatusBadge loading={state.loading} error={!!state.error} />
        {state.data && (
          <span style={{ color: "var(--text-muted)" }}>
            server:{" "}
            <span style={{ color: "var(--yellow)" }}>
              {state.data.meta.duration}ms
            </span>
          </span>
        )}
        {useSlowEndpoint && (
          <span style={{ color: "rgba(255,64,96,0.7)", fontSize: "10px" }}>
            ⚠ slow endpoint
          </span>
        )}
      </div>

      <div
        className="terminal p-3 text-xs leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        <span style={{ color: "var(--red)" }}>// Problems to profile:</span>
        <br />
        <span style={{ color: "var(--text-muted)" }}>
          → every remount triggers a new network request
        </span>
        <br />
        <span style={{ color: "var(--text-muted)" }}>
          → no dedup: 10 components = 10 requests for same URL
        </span>
        <br />
        <span style={{ color: "var(--text-muted)" }}>
          → race conditions require manual guards (see source)
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={fetchData}
          className="text-xs px-3 py-1.5 rounded font-medium transition-all"
          style={{
            background: "rgba(255,64,96,0.1)",
            color: "var(--red)",
            border: "1px solid rgba(255,64,96,0.25)",
          }}
        >
          ↻ Refetch (no cache)
        </button>
        <label
          className="flex items-center gap-2 text-xs cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        >
          <input
            type="checkbox"
            checked={useSlowEndpoint}
            onChange={(e) => setUseSlowEndpoint(e.target.checked)}
            className="rounded"
          />
          Use slow endpoint (~1s)
        </label>
      </div>

      <PostList
        posts={state.data?.posts}
        loading={state.loading}
        error={state.error}
      />

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
              style={{ color: i === 0 ? "var(--red)" : "var(--text-muted)" }}
            >
              {entry}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManualStatusBadge({
  loading,
  error,
}: {
  loading: boolean;
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
        fetching...
      </span>
    );
  return (
    <span
      className="px-2 py-0.5 rounded text-xs"
      style={{
        background: "rgba(255,64,96,0.1)",
        color: "var(--red)",
        border: "1px solid rgba(255,64,96,0.2)",
      }}
    >
      no cache
    </span>
  );
}

function PostList({
  posts,
  loading,
  error,
}: {
  posts?: Post[];
  loading?: boolean;
  error?: string | null;
}) {
  if (error)
    return (
      <div
        className="p-3 rounded text-xs"
        style={{
          background: "rgba(255,64,96,0.05)",
          color: "var(--red)",
          border: "1px solid rgba(255,64,96,0.2)",
        }}
      >
        {error}
      </div>
    );
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
            borderLeft: "2px solid var(--red)",
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
