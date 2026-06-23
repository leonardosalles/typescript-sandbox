import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createFileShareService } from "../infrastructure/compositionRoot";
import { App } from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(<div className="boot">Opening your encrypted vault…</div>);

createFileShareService().then((service) => {
  root.render(
    <StrictMode>
      <App service={service} />
    </StrictMode>,
  );
});
