import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchServers,
  serversSelectors,
  selectServer,
  setPollingActive,
} from "./store/slices/serversSlice";
import { fetchAlerts, alertsSelectors } from "./store/slices/alertsSlice";
import { fetchSummary, summarySelectors } from "./store/slices/summarySlice";
import { usePolling } from "./hooks/usePolling";
import { SummaryBar } from "./components/SummaryBar";
import { FilterBar } from "./components/FilterBar";
import { ServerCard } from "./components/ServerCard";
import { ServerDetail } from "./components/ServerDetail";
import { AlertsList } from "./components/AlertsList";

const POLL_INTERVAL = 6000;

export function App() {
  const dispatch = useAppDispatch();

  const servers = useAppSelector(serversSelectors.selectFiltered);
  const allServers = useAppSelector(serversSelectors.selectAll);
  const selectedServer = useAppSelector(serversSelectors.selectSelectedServer);
  const loading = useAppSelector(serversSelectors.selectLoading);
  const error = useAppSelector(serversSelectors.selectError);
  const lastFetched = useAppSelector(serversSelectors.selectLastFetched);
  const pollingActive = useAppSelector(serversSelectors.selectPollingActive);
  const summary = useAppSelector(summarySelectors.selectData);
  const summaryLastUpdated = useAppSelector(summarySelectors.selectLastUpdated);
  const alerts = useAppSelector(alertsSelectors.selectAll);

  usePolling(
    () => {
      dispatch(fetchServers());
      dispatch(fetchSummary());
      dispatch(fetchAlerts());
    },
    { interval: POLL_INTERVAL, enabled: pollingActive, immediate: true },
  );

  useEffect(() => {
    dispatch(setPollingActive(true));
    return () => {
      dispatch(setPollingActive(false));
    };
  }, [dispatch]);

  const isInitialLoad = loading && allServers.length === 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo">
            <span className="app-logo-icon">◈</span>
            <span className="app-logo-text">SYSWATCH</span>
          </div>
          <span className="app-tagline">Infrastructure Monitor</span>
        </div>
        <div className="app-header-right">
          <div className={`poll-indicator ${pollingActive ? "active" : ""}`}>
            <span className="poll-dot" />
            <span>{pollingActive ? "LIVE" : "PAUSED"}</span>
          </div>
          <button
            className="poll-toggle"
            onClick={() => dispatch(setPollingActive(!pollingActive))}
          >
            {pollingActive ? "⏸ Pause" : "▶ Resume"}
          </button>
        </div>
      </header>

      {summary && (
        <SummaryBar summary={summary} lastUpdated={summaryLastUpdated} />
      )}

      <div className="app-body">
        <main className="app-main">
          <FilterBar />

          {error && (
            <div className="error-banner">
              ⚠ Backend unreachable — {error}
              <span className="error-hint">
                Start the backend: <code>cd apps/backend && bun run dev</code>
              </span>
            </div>
          )}

          {isInitialLoad && (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="server-card-skeleton" />
              ))}
            </div>
          )}

          {!isInitialLoad && (
            <>
              <div className="servers-grid-header">
                <span className="servers-count">
                  {servers.length} server{servers.length !== 1 ? "s" : ""}
                  {servers.length !== allServers.length &&
                    ` (filtered from ${allServers.length})`}
                </span>
                {lastFetched && (
                  <span className="servers-refresh">
                    {loading
                      ? "⟳ Refreshing..."
                      : `Updated ${new Date(lastFetched).toLocaleTimeString()}`}
                  </span>
                )}
              </div>

              <div className="servers-grid">
                {servers.map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    selected={selectedServer?.id === server.id}
                    onClick={() =>
                      dispatch(
                        selectServer(
                          selectedServer?.id === server.id ? null : server.id,
                        ),
                      )
                    }
                  />
                ))}
                {servers.length === 0 && (
                  <div className="servers-empty">
                    No servers match the current filters
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        <aside className="app-sidebar">
          {selectedServer ? (
            <ServerDetail
              server={selectedServer}
              onClose={() => dispatch(selectServer(null))}
            />
          ) : (
            <AlertsList alerts={alerts} />
          )}
        </aside>
      </div>
    </div>
  );
}
