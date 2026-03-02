import { useState } from "react";
import "./App.css";
import FiberPage from "./pages/FiberPage";

function App() {
  const [mode, setMode] = useState("fiber");

  return (
    <div className="container">
      <nav className="nav">
        <button onClick={() => setMode("fiber")}>Fiber (Concurrent)</button>
      </nav>

      <FiberPage />
    </div>
  );
}

export default App;
