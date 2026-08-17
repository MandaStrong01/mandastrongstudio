import { createRoot } from "react-dom/client";
import App from "./App";
import { CareCoverApp } from "./CareCover";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  const isCareCover = window.location.pathname.startsWith("/carecover");
  createRoot(rootElement).render(isCareCover ? <CareCoverApp /> : <App />);
}
