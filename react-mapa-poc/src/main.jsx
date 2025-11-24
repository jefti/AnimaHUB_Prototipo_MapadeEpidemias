import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { MapProvider } from "./contexts/MapContext";
import Reset from './styles/Reset.js';
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MapProvider>
      <Reset />
      <App />
    </MapProvider>
  </React.StrictMode>
);
