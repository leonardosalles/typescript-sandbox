import type { Alert } from "../types";
import { severityConfig, formatRelativeTime } from "../utils/format";
import { useAppDispatch } from "../store/hooks";
import { dismissAlert } from "../store/slices/alertsSlice";

interface Props {
  alerts: Alert[];
}

export function AlertsList({ alerts }: Props) {
  const dispatch = useAppDispatch();
  const active = alerts.filter((a) => !a.resolved);

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h3 className="alerts-title">Active Alerts</h3>
        <span className="alerts-count">{active.length}</span>
      </div>

      {active.length === 0 && (
        <div className="alerts-empty">
          <span>✓</span>
          <p>All systems operational</p>
        </div>
      )}

      <div className="alerts-list">
        {active.map((alert) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className="alert-item"
              style={{ borderLeftColor: cfg.color, background: cfg.bg }}
            >
              <div className="alert-item-header">
                <span className="alert-severity" style={{ color: cfg.color }}>
                  {cfg.icon} {alert.severity.toUpperCase()}
                </span>
                <span className="alert-time">
                  {formatRelativeTime(alert.timestamp)}
                </span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-footer">
                <span className="alert-server">{alert.serverName}</span>
                <button
                  className="alert-dismiss"
                  onClick={() => dispatch(dismissAlert(alert.id))}
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
