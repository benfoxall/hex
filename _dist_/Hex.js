import React, {useEffect, useState, memo} from "../web_modules/react.js";
import {useMedia} from "./util.js";
import {useVirtual} from "../web_modules/react-virtual.js";
export const Hex = ({blob}) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());
  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);
  const sm = useMedia("(max-width: 800px)");
  const md = useMedia("(max-width: 800px)");
  const lg = useMedia("(max-width: 1400px)");
  const bytesPerRow = sm ? 8 : md ? 12 : lg ? 16 : 32;
  const view = new DataView(buffer);
  const size = Math.ceil(view.byteLength / bytesPerRow);
  const parentRef = React.useRef();
  const {totalSize, virtualItems} = useVirtual({
    size,
    parentRef,
    estimateSize: React.useCallback(() => 20, []),
    paddingEnd: 20,
    overscan: 5
  });
  return /* @__PURE__ */ React.createElement("main", {
    ref: parentRef
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      height: `${totalSize}px`,
      position: "relative"
    }
  }, virtualItems.map((virtualRow) => /* @__PURE__ */ React.createElement("div", {
    key: virtualRow.index,
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translateY(${virtualRow.start}px)`
    }
  }, /* @__PURE__ */ React.createElement(Row, {
    index: virtualRow.index,
    buffer,
    bytesPerRow
  })))));
};
const Row = memo(({index, buffer, bytesPerRow}) => {
  const byteOffset = index * bytesPerRow;
  const l = Math.min(bytesPerRow, buffer.byteLength - index * bytesPerRow);
  const u8 = new Uint8Array(buffer, byteOffset, l);
  return /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", null, (index * bytesPerRow).toString(16).padStart(4, ".")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(HexPairs, {
    u8,
    size: bytesPerRow
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Ascii, {
    u8,
    size: bytesPerRow
  })));
});
const HexPairs = ({u8, size}) => {
  const str = u8.reduce((acc, value) => {
    return acc + value.toString(16).padStart(2, "0") + " ";
  }, "");
  return str.padEnd(size * 3 - 1, "_");
};
const Ascii = ({u8}) => Array.from(u8, (value) => value < 33 || value == 127 || value === 173 || value >= 129 && value <= 159 ? "." : String.fromCharCode(value)).join("");
