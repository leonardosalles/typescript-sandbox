import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchDashboardStats } from "@/lib/api";
import { isAuthenticated, getAuth } from "@/store/auth";
import { StatCard, Skeleton } from "@/components/ui";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: { redirect: window.location.pathname },
      });
    }
  },

  loader: async () => {
    const stats = await fetchDashboardStats();
    return { stats };
  },

  staleTime: 10_000,

  pendingComponent: DashboardPending,

  component: DashboardPage,
});

function DashboardPage() {
  const { stats } = Route.useLoaderData();
  const auth = getAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {auth.user?.name.split(" ")[0]}</h1>
          <p className="page-subtitle">
            Here's what's happening in your workspace
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon="◎"
          delta={{ value: 8, label: "this month" }}
        />
        <StatCard
          label="Active Users"
          value={stats.activeUsers}
          icon="◉"
          delta={{ value: stats.growthRate, label: "vs last month" }}
        />
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          icon="▤"
          delta={{ value: 5, label: "this week" }}
        />
        <StatCard
          label="Total Views"
          value={stats.totalViews}
          icon="◈"
          delta={{ value: 12, label: "this month" }}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Quick Navigation</h2>
          <p className="card-desc">
            These links use TanStack Router's type-safe{" "}
            <code>&lt;Link&gt;</code> — hover to see preloading in devtools.
          </p>
          <div className="quick-links">
            <Link to="/dashboard/users" className="quick-link">
              <span>◎</span>
              <div>
                <strong>Users</strong>
                <span>Manage team members</span>
              </div>
            </Link>
            <Link to="/dashboard/posts" className="quick-link">
              <span>▤</span>
              <div>
                <strong>Posts</strong>
                <span>Content management</span>
              </div>
            </Link>
            <Link to="/dashboard/settings" className="quick-link">
              <span>⚙</span>
              <div>
                <strong>Settings</strong>
                <span>Admin-only section</span>
              </div>
            </Link>
            <Link to="/dashboard/reports" className="quick-link">
              <span>▦</span>
              <div>
                <strong>Reports (Lazy)</strong>
                <span>Code-split route</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>POC Features Demonstrated</h2>
          <div className="feature-list">
            {[
              {
                icon: "✓",
                label: "File-based routing",
                detail: "__root.tsx, /dashboard/index.tsx",
              },
              {
                icon: "✓",
                label: "Route loaders + staleTime",
                detail: "Data fetched before render",
              },
              {
                icon: "✓",
                label: "pendingComponent",
                detail: "Skeleton shown during load",
              },
              {
                icon: "✓",
                label: "beforeLoad auth guard",
                detail: "Redirects unauthenticated users",
              },
              {
                icon: "✓",
                label: "RouterContext",
                detail: "Auth injected into loaders",
              },
              {
                icon: "✓",
                label: "Type-safe search params + Zod",
                detail: "See Users & Posts pages",
              },
              {
                icon: "✓",
                label: "errorComponent per route",
                detail: "Try the error button on Users",
              },
              {
                icon: "✓",
                label: "lazyRouteComponent",
                detail: "Reports page is code-split",
              },
              {
                icon: "✓",
                label: "Role-based access",
                detail: "Settings requires admin role",
              },
            ].map((f) => (
              <div key={f.label} className="feature-item">
                <span className="feature-check">{f.icon}</span>
                <div>
                  <strong>{f.label}</strong>
                  <span>{f.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPending() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Skeleton width={200} height={28} />
          <Skeleton width={280} height={16} />
        </div>
      </div>
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card">
            <Skeleton height={60} />
          </div>
        ))}
      </div>
    </div>
  );
}
