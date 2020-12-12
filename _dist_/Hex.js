import React, {useEffect, useState} from "../web_modules/react.js";
export const Hex = ({blob}) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());
  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);
  console.log(buffer);
  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / 4);
  return /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", {
    className: "address"
  }), /* @__PURE__ */ React.createElement("col", {
    span: "4",
    className: "byte"
  }), /* @__PURE__ */ React.createElement("col", {
    span: "4",
    className: "ascii"
  })), /* @__PURE__ */ React.createElement("tbody", null, repeat(rows, (i) => /* @__PURE__ */ React.createElement("tr", {
    key: i
  }, /* @__PURE__ */ React.createElement("td", null, (i * 4).toString(16).padStart(4, ".")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Byte, {
    view,
    offset: i * 4
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Byte, {
    view,
    offset: i * 4 + 1
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Byte, {
    view,
    offset: i * 4 + 2
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Byte, {
    view,
    offset: i * 4 + 3
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Ascii, {
    view,
    offset: i * 4
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Ascii, {
    view,
    offset: i * 4 + 1
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Ascii, {
    view,
    offset: i * 4 + 2
  })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Ascii, {
    view,
    offset: i * 4 + 3
  }))))));
};
const Byte = ({view, offset}) => {
  if (view.byteLength > offset) {
    return view.getUint8(offset).toString(16).padStart(2, ".");
  } else {
    return "__";
  }
};
const Ascii = ({view, offset}) => {
  if (view.byteLength > offset) {
    return String.fromCharCode(view.getUint8(offset));
  } else {
    return "_";
  }
};
function repeat(length, fn) {
  return Array.from({length}, (_, i) => fn(i));
}
