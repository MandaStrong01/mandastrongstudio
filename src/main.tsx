import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Removed .jsx to let Vite find your App.tsx file
import "./index.css";

// Note: If you are not using the AuthContext right now, 
// you can comment out the provider lines below.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);