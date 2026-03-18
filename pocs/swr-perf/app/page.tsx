import { SWRProvider } from "./components/SWRProvider";
import { SWRPanel } from "./components/SWRPanel";
import { ManualPanel } from "./components/ManualPanel";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { DeduplicationDemo } from "./components/DeduplicationDemo";
import { ProfilingGuide } from "./components/ProfilingGuide";

export default function Home() {
  return (
    <SWRProvider>
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <header
          className="border-b px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="font-extrabold text-xl tracking-tight"
                  style={{
                    color: "var(--text)",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  SWR vs Manual Fetch
                </h1>
                <span
                  className="text-xs mono px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(168,85,247,0.1)",
                    color: "var(--purple)",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  PERFORMANCE POC
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Deep dive into data fetching strategies, caching, deduplication
                and profiling with Chrome DevTools
              </p>
            </div>
            <div
              className="flex gap-4 text-xs mono shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <div>
                <p style={{ color: "var(--green)" }}>SWR</p>
                <p>stale-while-revalidate</p>
              </div>
              <div>
                <p style={{ color: "var(--red)" }}>Manual</p>
                <p>useEffect + fetch</p>
              </div>
            </div>
          </div>
        </header>

        <div
          className="px-6 py-2 text-center text-xs mono"
          style={{
            background: "rgba(64,128,255,0.05)",
            borderBottom: "1px solid var(--border)",
            color: "var(--blue)",
          }}
        >
          💡 Open Chrome DevTools → Performance tab → Record while using this
          page. See the README for detailed profiling instructions.
        </div>

        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <SWRPanel />
            <ManualPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <MetricsDashboard />
            <DeduplicationDemo />
          </div>

          <ProfilingGuide />
        </main>
      </div>
    </SWRProvider>
  );
}
