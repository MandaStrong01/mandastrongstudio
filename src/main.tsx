import { createRoot } from "react-dom/client";
import App from "./App";
import { CareCoverApp } from "./CareCover";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  const path = window.location.pathname.toLowerCase();
  const host = window.location.hostname.toLowerCase();
  const isCareCover = path.startsWith("/carecover") || host.includes("-cc.");
  createRoot(rootElement).render(isCareCover ? <CareCoverApp /> : <App />);
}
