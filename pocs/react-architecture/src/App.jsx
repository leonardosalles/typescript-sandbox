import { useState } from "react";
import "./App.css";
import FiberPage from "./pages/FiberPage";
import LegacyPage from "./pages/LegacyPage";

function App() {
  const [mode, setMode] = useState("fiber");

  return (
    <div className="container">
      <nav className="nav">
        <button onClick={() => setMode("fiber")}>Fiber (Concurrent)</button>
        <button onClick={() => setMode("legacy")}>Legacy (Sync)</button>
      </nav>

      <main>{mode === "fiber" ? <FiberPage /> : <LegacyPage />}</main>
    </div>
  );
}

export default App;
