if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,d)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const o={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return o;default:return e(s)}}))).then((e=>{const s=d(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-e1834b40"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"__snowpack__/env.js",revision:"303f8e8516cdfb0a447e7a9dc7c57a3b"},{url:"_dist_/App.js",revision:"89bd37fbe0d8712f15a9827ee3a91911"},{url:"_dist_/Hex.js",revision:"0c1b5983a5ae30ecb2c0970a3c8f33ea"},{url:"_dist_/index.js",revision:"140522ddd0babd9cac672a7459b14ab4"},{url:"_dist_/Usage.js",revision:"8b5c6acb87794543890f08a89c7b742b"},{url:"_dist_/util.js",revision:"78f94d3f4dd2bf8bff0e4824e999679d"},{url:"favicon.ico",revision:"1b5e95dd396c24e0e4d6486e367aa881"},{url:"index.html",revision:"6881b88fd5aea688f70fd2abd0bedda5"},{url:"popup.js",revision:"4e3f4a0390794c17fe39c50f52f610d0"},{url:"style.css",revision:"d6dee30b261367cb9498a8cd8d55c5ad"},{url:"web_modules/common/index-0ff745df.js",revision:"0f12945066af12da2398c9d1e6f21605"},{url:"web_modules/import-map.json",revision:"b1c8179578be96d85f27372c18dc1e4a"},{url:"web_modules/pretty-bytes.js",revision:"e442480566018e33e610c9b361764c18"},{url:"web_modules/react-dom.js",revision:"2fdaffec3daae0d06f48ca9be043a58d"},{url:"web_modules/react-dropzone.js",revision:"ab606370a4f5a9b80c06064ccb7ce689"},{url:"web_modules/react-virtual.js",revision:"4a90897bf8828f8b5a6d76c6cf0b53bf"},{url:"web_modules/react.js",revision:"c9bfa82561dee340dff34c8fda3b145d"},{url:"web_modules/workbox-window.js",revision:"3fce41f2859ec8a708bace6fbb034682"}],{})}));
//# sourceMappingURL=sw.js.map