import { useEffect, useState } from "react";

interface NotifierProps {
  title: string;
  body: string;
}

export function Notifier({ title, body }: NotifierProps) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.electronAPI.notify(title, body).then(() => setSent(true));
  }, []);

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">🔔</span>
        <span>Notification</span>
      </div>
      <div className="notifier-content">
        <p className="notifier-title">{title}</p>
        <p className="notifier-body">{body}</p>
      </div>
      <div
        className={`tambo-status tambo-status--${sent ? "done" : "loading"}`}
      >
        {sent ? "✅ Notification sent!" : "⏳ Sending…"}
      </div>
    </div>
  );
}

interface OpenUrlProps {
  url: string;
  label?: string;
}

export function OpenUrl({ url, label }: OpenUrlProps) {
  const [opened, setOpened] = useState(false);

  const handleOpen = async () => {
    await window.electronAPI.openUrl(url);
    setOpened(true);
  };

  useEffect(() => {
    handleOpen();
  }, []);

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">🌐</span>
        <span>Open URL</span>
      </div>
      <p className="open-url-label">{label ?? url}</p>
      <p className="open-url-href">{url}</p>
      <div
        className={`tambo-status tambo-status--${opened ? "done" : "loading"}`}
      >
        {opened ? "Opened in browser!" : "Opening…"}
      </div>
      <button className="tambo-btn" onClick={handleOpen}>
        Open Again
      </button>
    </div>
  );
}
