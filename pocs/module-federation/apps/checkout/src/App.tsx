import ReactDOM from "react-dom/client";

import Cart from "./pages/Cart";

import "./index.css";

const App = () => (
  <>
    <Cart />
  </>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
