import __SNOWPACK_ENV__ from './__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

/*
  A helper for opening the ui and sending data to it.

  (This isn't the actual code)
*/

// Find the address relative to this script location
const url = new URL(import.meta.url.replace(/popup\.js$/, ""));

// reference to the opened window
let hex = null;

async function open() {
  // might be already there
  if (hex && !hex.closed) return;

  // open the window
  hex = window.open(url.href, "hex", "width=500");

  // wait until we've heard something back
  await new Promise((resolve) => {
    const listen = (e) => {
      if (e.origin === url.origin && e.data === "ready") {
        console.log("READY");
        window.removeEventListener("message", listen);
        resolve();
      }
    };
    window.addEventListener("message", listen);
  });
}

function asBuffer(any) {
  if (any instanceof ArrayBuffer) {
    return any;
  }
  if (any.buffer instanceof ArrayBuffer) {
    return any.buffer;
  }
  if (typeof any === "string") {
    return new TextEncoder().encode(any).buffer;
  }

  throw new Error("Data must be: ArrayBuffer, TypedArray, or String");
}

export async function view(data) {
  const buffer = asBuffer(data);

  await open();

  hex.postMessage(buffer, url.origin);
  hex.focus();
}
