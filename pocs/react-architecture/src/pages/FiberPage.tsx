import Visualizer from "../components/Visualizer";
import { useHeavyCompute } from "../hooks/useHeavyCompute";

export default function FiberPage() {
  const { text, items, isPending, updateData } = useHeavyCompute("fiber");

  return (
    <div className="fiber-mode">
      <header>
        <span>Concurrent Mode (Deep Hook Architecture)</span>
        <h1>Fiber Rendering Engine</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          value={text}
          onChange={(e) => updateData(e.target.value)}
          placeholder="Type fast..."
        />
        {isPending && (
          <p className="loading-label">Fiber processing in background...</p>
        )}
      </div>

      <Visualizer items={items} label="Fiber" />
    </div>
  );
}
