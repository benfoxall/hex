import __SNOWPACK_ENV__ from '../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../web_modules/react.js";
import {render} from "../web_modules/react-dom.js";
import {Workbox} from "../web_modules/workbox-window.js";
import {App} from "./App.js";
render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("root"));
if (import.meta.env.MODE === "production" && "serviceWorker" in navigator) {
  const wb = new Workbox("sw.js");
  wb.register();
}
