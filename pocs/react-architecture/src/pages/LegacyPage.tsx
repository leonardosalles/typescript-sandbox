import { useHeavyCompute } from "../hooks/useHeavyCompute";
import Visualizer from "../components/Visualizer";
import { useJankMonitor } from "../hooks/useJankMonitor";

export default function LegacyPage() {
  const { text, items, updateData } = useHeavyCompute("legacy");

  useJankMonitor("Legacy Mode");

  return (
    <div className="sync-mode">
      <header>
        <span>Sync Mode (No Transition)</span>
        <h1>Legacy Rendering Engine</h1>
      </header>

      <input
        type="text"
        value={text}
        onChange={(e) => updateData(e.target.value)}
        placeholder="Input will freeze..."
      />

      <p>
        Status:{" "}
        {items.length > 0 ? "Rendering in a blocking way..." : "Waiting..."}
      </p>

      <Visualizer items={items} label="Legacy" />
    </div>
  );
}
