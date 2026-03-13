import {
  createFileRoute,
  redirect,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { isAuthenticated } from "@/store/auth";

export const Route = createFileRoute("/dashboard/reports")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/login" });
  },

  loader: async () => {
    const stats = await import("@/lib/api").then((m) =>
      m.fetchDashboardStats(),
    );
    return { stats };
  },

  pendingComponent: () => (
    <div className="page">
      <div className="page-header">
        <div className="skeleton" style={{ width: 150, height: 28 }} />
        <div className="skeleton" style={{ width: 300, height: 16 }} />
      </div>
      <div className="skeleton" style={{ height: 400 }} />
    </div>
  ),

  component: lazyRouteComponent(() => import("./_reports.lazy"), "ReportsPage"),
});
