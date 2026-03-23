import { useEffect, useState } from "react";

interface SystemInfoProps {
  showDetails?: boolean;
}

interface Info {
  platform: string;
  arch: string;
  version: string;
  nodeVersion: string;
}

export function SystemInfo({ showDetails = true }: SystemInfoProps) {
  const [info, setInfo] = useState<Info | null>(null);
  const [extra, setExtra] = useState<Record<string, string>>({});

  useEffect(() => {
    window.electronAPI.getSystemInfo().then(setInfo);
    if (showDetails) {
      const cmds = ["date", "whoami", "hostname"];
      cmds.forEach((cmd) => {
        window.electronAPI.runCommand(cmd).then((r) => {
          if (r.success && r.output) {
            setExtra((prev) => ({ ...prev, [cmd]: r.output! }));
          }
        });
      });
    }
  }, []);

  const platformEmoji: Record<string, string> = {
    darwin: "🍎",
    linux: "🐧",
    win32: "🪟",
  };

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">💻</span>
        <span>System Info</span>
      </div>

      {info ? (
        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">Platform</span>
            <span className="info-value">
              {platformEmoji[info.platform] ?? "🖥️"} {info.platform}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Architecture</span>
            <span className="info-value">{info.arch}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Electron</span>
            <span className="info-value">v{info.version}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Node.js</span>
            <span className="info-value">v{info.nodeVersion}</span>
          </div>
          {Object.entries(extra).map(([k, v]) => (
            <div className="info-row" key={k}>
              <span className="info-label">{k}</span>
              <span className="info-value">{v}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="tambo-loading">Loading system info…</p>
      )}
    </div>
  );
}
