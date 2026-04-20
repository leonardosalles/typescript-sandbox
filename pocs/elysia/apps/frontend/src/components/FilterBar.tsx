import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setStatusFilter,
  setEnvironmentFilter,
  serversSelectors,
} from "../store/slices/serversSlice";
import type { ServerStatus } from "../types";

export function FilterBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(serversSelectors.selectFilters);
  const allServers = useAppSelector(serversSelectors.selectAll);

  const regions = [...new Set(allServers.map((s) => s.region))].sort();

  const statusOptions: {
    value: ServerStatus | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "All", color: "#a78bfa" },
    { value: "healthy", label: "Healthy", color: "#00ff9d" },
    { value: "warning", label: "Warning", color: "#ffb800" },
    { value: "critical", label: "Critical", color: "#ff3d6b" },
    { value: "offline", label: "Offline", color: "#5a5a72" },
  ];

  const envOptions = ["all", "production", "staging", "development"] as const;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">STATUS</span>
        <div className="filter-chips">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-chip ${filters.status === opt.value ? "active" : ""}`}
              style={
                filters.status === opt.value
                  ? { borderColor: opt.color, color: opt.color }
                  : {}
              }
              onClick={() => dispatch(setStatusFilter(opt.value))}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">ENV</span>
        <div className="filter-chips">
          {envOptions.map((env) => (
            <button
              key={env}
              className={`filter-chip ${filters.environment === env ? "active" : ""}`}
              onClick={() => dispatch(setEnvironmentFilter(env))}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {regions.length > 0 && (
        <div className="filter-group">
          <span className="filter-label">REGION</span>
          <div className="filter-chips">
            <button
              className={`filter-chip ${filters.region === "all" ? "active" : ""}`}
              onClick={() =>
                dispatch({ type: "servers/setRegionFilter", payload: "all" })
              }
            >
              all
            </button>
            {regions.map((region) => (
              <button
                key={region}
                className={`filter-chip ${filters.region === region ? "active" : ""}`}
                onClick={() =>
                  dispatch({ type: "servers/setRegionFilter", payload: region })
                }
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
