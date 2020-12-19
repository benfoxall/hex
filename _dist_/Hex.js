import React, {useEffect, useState, memo} from "../web_modules/react.js";
import {useVirtual} from "../web_modules/react-virtual.js";
const MemoRow = memo(({index, buffer, bytesPerRow}) => {
  const byteOffset = index * bytesPerRow;
  const l = Math.min(bytesPerRow, buffer.byteLength - index * bytesPerRow);
  const u8 = new Uint8Array(buffer, byteOffset, l);
  return /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", null, (index * 4).toString(16).padStart(4, ".")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(HexPairs, {
    u8
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Ascii, {
    u8
  })));
});
export const Hex = ({blob}) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());
  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);
  const bytesPerRow = 16;
  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / bytesPerRow);
  const parentRef = React.useRef();
  const rowVirtualizer = useVirtual({
    size: rows,
    parentRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 5
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    ref: parentRef,
    className: "List",
    style: {
      height: `200px`,
      width: `800px`,
      overflow: "auto"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      height: `${rowVirtualizer.totalSize}px`,
      width: "100%",
      position: "relative"
    }
  }, rowVirtualizer.virtualItems.map((virtualRow) => /* @__PURE__ */ React.createElement("div", {
    key: virtualRow.index,
    className: virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `${virtualRow.size}px`,
      transform: `translateY(${virtualRow.start}px)`
    }
  }, /* @__PURE__ */ React.createElement(MemoRow, {
    index: virtualRow.index,
    buffer,
    bytesPerRow
  }))))));
};
const HexPairs = ({u8}) => {
  return u8.reduce((acc, value) => {
    return acc + value.toString(16).padStart(2, "0") + " ";
  }, "");
};
const Ascii = ({u8}) => {
  return u8.reduce((acc, value) => {
    return acc + String.fromCharCode(value);
  }, "");
};
