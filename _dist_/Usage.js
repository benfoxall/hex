import React from "../web_modules/react.js";
const help = Object.assign(document.createElement("a"), {href: "h.js"});
const helperUrl = help.href;
export const Usage = () => /* @__PURE__ */ React.createElement("pre", {
  className: "hljs"
}, "hex = ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-keyword"
}, "await"), " ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-keyword"
}, "import"), "(", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-string"
}, '"', helperUrl, '"'), ")", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "hex.view(", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-keyword"
}, "new"), " ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-built_in"
}, "Uint8Array"), "([", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-number"
}, "1"), ",", " ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-number"
}, "2"), ",", " ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-number"
}, "3"), ",", " ", /* @__PURE__ */ React.createElement("span", {
  className: "hljs-number"
}, "4"), "]))");
