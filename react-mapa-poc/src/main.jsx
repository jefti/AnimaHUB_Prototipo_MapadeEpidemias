import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MapProvider } from "./contexts/MapContext";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>
);
