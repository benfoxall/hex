/*
  A helper for opening the ui and sending data to it.

  (This isn't the actual code)
*/

// Find the page path
const url = new URL(import.meta.url.replace(/h\.js$/, ""));

let hex = null;

async function popup() {
  // might be already loaded
  if (hex && !hex.closed) return;

  // open the window
  hex = window.open(url.href, "hex", "width=300");

  // wait until we've heard something back
  await new Promise((resolve) => {
    const listen = (e) => {
      if (e.origin === url.origin) {
        window.removeEventListener("message", listen);
        resolve();
      }
    };
    window.addEventListener("message", listen);
  });
}

export async function view(data) {
  await popup();

  hex.postMessage(data, "*");
  hex.focus();
}
