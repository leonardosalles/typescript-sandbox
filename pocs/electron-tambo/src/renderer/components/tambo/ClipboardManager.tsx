import { useEffect, useState } from "react";

interface ClipboardManagerProps {
  action: "read" | "write";
  text?: string;
}

export function ClipboardManager({ action, text }: ClipboardManagerProps) {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [clipContent, setClipContent] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleAction();
  }, []);

  async function handleAction() {
    setStatus("loading");
    try {
      if (action === "read") {
        const result = await window.electronAPI.clipboardRead();
        setClipContent(result.text);
        setMessage("Clipboard content read successfully");
        setStatus("done");
      } else if (action === "write" && text) {
        await window.electronAPI.clipboardWrite(text);
        setClipContent(text);
        setMessage(`Text copied to clipboard`);
        setStatus("done");
      }
    } catch (e) {
      setMessage(String(e));
      setStatus("error");
    }
  }

  async function handleCopyAgain() {
    if (clipContent) {
      await window.electronAPI.clipboardWrite(clipContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">📋</span>
        <span>Clipboard {action === "read" ? "Reader" : "Writer"}</span>
      </div>

      {status === "done" && clipContent && (
        <div className="clipboard-content">
          <p className="clipboard-label">{action === "read" ? "Current clipboard:" : "Copied text:"}</p>
          <div className="clipboard-text">{clipContent.slice(0, 200)}{clipContent.length > 200 ? "…" : ""}</div>
        </div>
      )}

      <div className={`tambo-status tambo-status--${status}`}>
        {status === "loading" && "⏳ Accessing clipboard…"}
        {status === "done" && `✅ ${message}`}
        {status === "error" && `❌ ${message}`}
      </div>

      {action === "read" && clipContent && (
        <button className="tambo-btn" onClick={handleCopyAgain}>
          {copied ? "✅ Copied!" : "Copy Again"}
        </button>
      )}
    </div>
  );
}
