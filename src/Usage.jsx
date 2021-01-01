import React from "react";

// use a link to get an absolute url to helper lib
const help = Object.assign(document.createElement("a"), { href: "h.js" });

const helperUrl = help.href;

/*
console.log(require('highlight.js').highlight('js',
  'const hex = await import("url")\nhex.view(new Uint8Array([1, 2, 3, 4]))'
).value)
*/

export const Usage = () => (
  <pre className="hljs">
    <span className="hljs-keyword">const</span> hex ={" "}
    <span className="hljs-keyword">await</span>{" "}
    <span className="hljs-keyword">import</span>(
    <span className="hljs-string">&quot;{helperUrl}&quot;</span>)<br />
    <br />
    hex.view(
    <span className="hljs-keyword">new</span>{" "}
    <span className="hljs-built_in">Uint8Array</span>([
    <span className="hljs-number">1</span>,{" "}
    <span className="hljs-number">2</span>,{" "}
    <span className="hljs-number">3</span>,{" "}
    <span className="hljs-number">4</span>]))
  </pre>
);
