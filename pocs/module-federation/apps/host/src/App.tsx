import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./router";

const App = () => <RouterProvider router={router} />;

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);
