import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { RouterContext } from "@/types/router";
import { getAuth, logout } from "@/store/auth";
import { useNavigate } from "@tanstack/react-router";
import { ErrorDisplay } from "@/components/ui";

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: ({ error, reset }) => (
    <div className="root-error">
      <ErrorDisplay
        error={error as Error}
        title="Application Error"
        retry={reset}
      />
    </div>
  ),
  component: RootLayout,
});

function RootLayout() {
  const auth = getAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  if (currentPath.startsWith("/login")) {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">AdminPOC</span>
        </div>

        <nav className="sidebar-nav">
          <NavSection label="Main">
            <NavLink to="/dashboard" icon="◉" label="Dashboard" />
          </NavSection>
          <NavSection label="Content">
            <NavLink to="/dashboard/users" icon="◎" label="Users" />
            <NavLink to="/dashboard/posts" icon="▤" label="Posts" />
          </NavSection>
          <NavSection label="System">
            <NavLink to="/dashboard/settings" icon="⚙" label="Settings" />
            <NavLink to="/dashboard/reports" icon="▦" label="Reports (Lazy)" />
          </NavSection>
        </nav>

        <div className="sidebar-footer">
          {auth.user && (
            <div className="user-chip">
              <div className="user-avatar">{auth.user.avatar}</div>
              <div className="user-info">
                <span className="user-name">{auth.user.name}</span>
                <span className="user-role">{auth.user.role}</span>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                ⎋
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="route-debug">{currentPath}</span>
          </div>
        </header>
        <div className="page-body">
          <Outlet />
        </div>
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

function NavLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="nav-link"
      activeProps={{ className: "nav-link active" }}
      activeOptions={{ exact: to === "/dashboard" }}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  );
}

function NavSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="nav-section">
      <span className="nav-section-label">{label}</span>
      {children}
    </div>
  );
}
