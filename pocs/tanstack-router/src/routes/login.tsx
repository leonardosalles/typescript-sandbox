import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth, login } from "@/store/auth";
import { Spinner } from "@/components/ui";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const auth = getAuth();
    if (auth.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@poc.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⬡</div>
          <h1>AdminPOC</h1>
          <p>TanStack Router Deep Dive</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@poc.dev"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? <Spinner label="Signing in..." /> : "Sign In"}
          </button>
        </form>

        <div className="login-hints">
          <p>
            Try these accounts (password: <code>admin123</code>):
          </p>
          <div className="account-list">
            {[
              { email: "admin@poc.dev", role: "admin" },
              { email: "editor@poc.dev", role: "editor" },
              { email: "viewer@poc.dev", role: "viewer" },
            ].map((a) => (
              <button
                key={a.email}
                className="account-chip"
                onClick={() => setEmail(a.email)}
              >
                <span className={`role-badge role-${a.role}`}>{a.role}</span>
                {a.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
