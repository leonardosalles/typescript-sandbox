import { useEffect, useState } from "react";

interface VolumeControlProps {
  targetVolume?: number;
  action?: "set" | "mute" | "unmute" | "increase" | "decrease";
}

export function VolumeControl({
  targetVolume = 50,
  action = "set",
}: VolumeControlProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [currentVol, setCurrentVol] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleAction();
  }, []);

  async function handleAction() {
    setStatus("loading");
    try {
      let vol = targetVolume;
      if (action === "mute") vol = 0;
      if (action === "unmute") vol = 50;
      if (action === "increase") {
        const cur = await window.electronAPI.getVolume();
        vol = Math.min(100, (cur.volume ?? 50) + 20);
      }
      if (action === "decrease") {
        const cur = await window.electronAPI.getVolume();
        vol = Math.max(0, (cur.volume ?? 50) - 20);
      }

      const result = await window.electronAPI.setVolume(vol);
      if (result.success) {
        setCurrentVol(vol);
        setMessage(`Volume set to ${vol}%`);
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

  const pct = currentVol ?? targetVolume;

  return (
    <div className="tambo-card">
      <div className="tambo-card-header">
        <span className="tambo-icon">🔊</span>
        <span>Volume Control</span>
      </div>

      <div className="volume-display">
        <div className="volume-bar-bg">
          <div
            className="volume-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="volume-pct">{pct}%</span>
      </div>

      <div className={`tambo-status tambo-status--${status}`}>
        {status === "loading" && "⏳ Applying…"}
        {status === "done" && `✅ ${message}`}
        {status === "error" && `❌ ${message}`}
        {status === "idle" && "Ready"}
      </div>

      <button className="tambo-btn" onClick={handleAction}>
        Apply Again
      </button>
    </div>
  );
}
