// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./scss/index.scss"; // si existe; si no, comentá esta línea

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
