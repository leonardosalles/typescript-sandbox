import { useEffect, useState } from "react";

interface BrightnessControlProps {
  targetBrightness?: number;
  action?: "set" | "increase" | "decrease";
}

export function BrightnessControl({ targetBrightness = 70, action = "set" }: BrightnessControlProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("loading");
  const [current, setCurrent] = useState(targetBrightness);
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleAction();
  }, []);

  async function handleAction() {
    setStatus("loading");
    try {
      let level = targetBrightness;
      if (action === "increase") {
        const cur = await window.electronAPI.getBrightness();
        level = Math.min(100, (cur.brightness ?? 50) + 20);
      }
      if (action === "decrease") {
        const cur = await window.electronAPI.getBrightness();
        level = Math.max(0, (cur.brightness ?? 50) - 20);
      }
      const result = await window.electronAPI.setBrightness(level);
      if (result.success) {
        setCurrent(level);
        setMessage(`Brightness set to ${level}%`);
        setStatus("done");
      } else {
        setMessage(result.error ?? "Unknown error");
        setStatus("error");
      }
    } catch (e) {
      setMessage(String(e));
      setStatus("error");
    }
  }

  const sunSize = 12 + (current / 100) * 10;

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">☀️</span>
        <span>Brightness Control</span>
      </div>
      <div className="brightness-display">
        <div className="brightness-sun" style={{ width: sunSize, height: sunSize }} />
        <div className="vol-bar-bg" style={{ flex: 1 }}>
          <div className="brightness-bar-fill" style={{ width: `${current}%` }} />
        </div>
        <span className="vol-pct">{current}%</span>
      </div>
      <div className={`tambo-status tambo-status--${status}`}>
        {status === "loading" && "⏳ Applying…"}
        {status === "done" && `✅ ${message}`}
        {status === "error" && `❌ ${message}`}
      </div>
      <button className="tambo-btn" onClick={handleAction}>Apply Again</button>
    </div>
  );
}
