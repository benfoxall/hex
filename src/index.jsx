import React from "react";
import { render } from "react-dom";
import { Workbox } from "workbox-window";
import { App } from "./App";

render(<App />, document.getElementById("root"));

if (import.meta.env.MODE === "production" && "serviceWorker" in navigator) {
  const wb = new Workbox("sw.js");

  wb.register();
}
