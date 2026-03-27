import { useEffect, useState } from "react";

interface AppLauncherProps {
  appName: string;
  showSuggestions?: boolean;
}

export function AppLauncher({ appName, showSuggestions = false }: AppLauncherProps) {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [message, setMessage] = useState("");
  const [apps, setApps] = useState<string[]>([]);
  const [launching, setLaunching] = useState<string | null>(null);

  useEffect(() => {
    handleLaunch(appName);
    if (showSuggestions) loadApps();
  }, []);

  async function handleLaunch(name: string) {
    setStatus("loading");
    setLaunching(name);
    try {
      const result = await window.electronAPI.launchApp(name);
      if (result.success) {
        setMessage(`"${name}" launched successfully`);
        setStatus("done");
      } else {
        setMessage(result.error ?? "Could not launch app");
        setStatus("error");
      }
    } catch (e) {
      setMessage(String(e));
      setStatus("error");
    } finally {
      setLaunching(null);
    }
  }

  async function loadApps() {
    const result = await window.electronAPI.listApps();
    if (result.success) setApps(result.apps.slice(0, 8));
  }

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">🚀</span>
        <span>App Launcher</span>
      </div>

      <div className="launcher-target">
        <span className="launcher-app-name">{appName}</span>
      </div>

      <div className={`tambo-status tambo-status--${status}`}>
        {status === "loading" && `⏳ Launching "${launching}"…`}
        {status === "done" && `✅ ${message}`}
        {status === "error" && `❌ ${message}`}
      </div>

      {apps.length > 0 && (
        <div className="launcher-suggestions">
          <p className="launcher-suggestions-label">Other apps:</p>
          <div className="launcher-grid">
            {apps.filter(a => a !== appName).map((a) => (
              <button
                key={a}
                className="launcher-chip"
                onClick={() => handleLaunch(a)}
                disabled={launching === a}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="tambo-btn" onClick={() => handleLaunch(appName)}>
        Launch Again
      </button>
    </div>
  );
}
