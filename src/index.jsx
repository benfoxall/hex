import React from "react";
import { createRoot } from "react-dom/client";
import { Workbox } from "workbox-window";
import { App } from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  const wb = new Workbox("/sw.js");
  wb.register();
}
