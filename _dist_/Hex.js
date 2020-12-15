import React, {useEffect, useRef, useState} from "../web_modules/react.js";
export const Hex = ({blob}) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());
  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);
  const BYTES = 16;
  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / BYTES);
  return /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, repeat(rows, (i) => {
    const l = Math.min(BYTES, buffer.byteLength - i * BYTES);
    const sub = new DataView(buffer, i * BYTES, l);
    return /* @__PURE__ */ React.createElement("tr", {
      key: i
    }, /* @__PURE__ */ React.createElement("td", null, (i * 4).toString(16).padStart(4, ".")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(HexPairs, {
      view: sub
    })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Ascii, {
      view: sub
    })));
  })));
};
const HexPairs = ({view}) => {
  let acc = "";
  for (let i = 0; i < view.byteLength; i++) {
    acc += view.getUint8(i).toString(16).padStart(2, ".") + " ";
  }
  return acc;
};
const Ascii = ({view}) => {
  let acc = "";
  for (let i = 0; i < view.byteLength; i++) {
    acc += String.fromCharCode(view.getUint8(i));
  }
  return acc;
};
function repeat(length, fn) {
  return Array.from({length}, (_, i) => fn(i));
}
