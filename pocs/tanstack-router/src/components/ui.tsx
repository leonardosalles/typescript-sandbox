import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  const styles: Record<BadgeVariant, string> = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
    neutral: "badge-neutral",
  };
  return <span className={`badge ${styles[variant]}`}>{children}</span>;
}

export function Skeleton({
  width,
  height = 16,
}: {
  width?: string | number;
  height?: number;
}) {
  return (
    <div className="skeleton" style={{ width: width ?? "100%", height }} />
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={20} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ErrorDisplay({
  error,
  retry,
  title = "Something went wrong",
}: {
  error: Error;
  retry?: () => void;
  title?: string;
}) {
  return (
    <div className="error-display">
      <div className="error-icon">⚠</div>
      <h3>{title}</h3>
      <p className="error-message">{error.message}</p>
      {retry && (
        <button className="btn btn-primary" onClick={retry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  delta,
}: {
  label: string;
  value: string | number;
  icon: string;
  delta?: { value: number; label: string };
}) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {delta && (
        <div
          className={`stat-delta ${delta.value >= 0 ? "positive" : "negative"}`}
        >
          {delta.value >= 0 ? "↑" : "↓"} {Math.abs(delta.value)}% {delta.label}
        </div>
      )}
    </div>
  );
}

export function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  return <div className={`avatar avatar-${size}`}>{initials}</div>;
}

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
