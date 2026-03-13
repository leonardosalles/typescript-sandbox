import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated, hasRole, getAuth } from "@/store/auth";
import { useState } from "react";

type DefaultRole = "admin" | "editor" | "viewer";

type Settings = {
  siteName: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultRole: DefaultRole;
  sessionTimeout: number;
  emailNotifications: boolean;
  auditLog: boolean;
};

export const Route = createFileRoute("/dashboard/settings/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
    if (!hasRole("admin")) {
      throw redirect({
        to: "/dashboard",
        search: { error: "insufficient_permissions" },
      });
    }
  },

  loader: () => {
    const auth = getAuth();
    return {
      currentUser: auth.user!,
      settings: {
        siteName: "AdminPOC",
        maintenanceMode: false,
        allowRegistration: true,
        defaultRole: "viewer" as DefaultRole,
        sessionTimeout: 30,
        emailNotifications: true,
        auditLog: true,
      } satisfies Settings,
    };
  },

  component: SettingsPage,
});

function SettingsPage() {
  const { currentUser, settings: initialSettings } = Route.useLoaderData();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Admin-only section — role-based access via <code>beforeLoad</code>
          </p>
        </div>
      </div>

      <div className="debug-panel">
        <strong>Access granted to:</strong> {currentUser.name} (
        {currentUser.role})
        <span> — Try logging in as editor/viewer to see the redirect</span>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h2>General</h2>
          <div className="setting-field">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings((p) => ({ ...p, siteName: e.target.value }))
              }
              className="filter-input"
            />
          </div>
          <div className="setting-field">
            <label>Default Role for New Users</label>
            <select
              className="filter-select"
              value={settings.defaultRole}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  defaultRole: e.target.value as Settings["defaultRole"],
                }))
              }
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="setting-field">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  sessionTimeout: Number(e.target.value),
                }))
              }
              className="filter-input"
              style={{ width: 100 }}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Toggles</h2>
          {[
            {
              key: "maintenanceMode" as const,
              label: "Maintenance Mode",
              desc: "Disables public access",
            },
            {
              key: "allowRegistration" as const,
              label: "Allow Registration",
              desc: "New users can sign up",
            },
            {
              key: "emailNotifications" as const,
              label: "Email Notifications",
              desc: "Send email alerts",
            },
            {
              key: "auditLog" as const,
              label: "Audit Log",
              desc: "Log all admin actions",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="setting-toggle">
              <div>
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
              <button
                className={`toggle ${settings[key] ? "on" : "off"}`}
                onClick={() => toggle(key)}
              >
                {settings[key] ? "ON" : "OFF"}
              </button>
            </div>
          ))}
        </div>

        <div className="settings-section">
          <h2>Danger Zone</h2>
          <div className="danger-actions">
            <div className="danger-item">
              <div>
                <strong>Clear Cache</strong>
                <span>Flush all cached data</span>
              </div>
              <button className="btn btn-danger-outline">Clear</button>
            </div>
            <div className="danger-item">
              <div>
                <strong>Reset to Defaults</strong>
                <span>Revert all settings</span>
              </div>
              <button
                className="btn btn-danger-outline"
                onClick={() => setSettings(initialSettings)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
