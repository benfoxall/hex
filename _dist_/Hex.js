import React, {useEffect, useState, memo, useMemo} from "../web_modules/react.js";
import {useVirtual} from "../web_modules/react-virtual.js";
export const Hex = ({blob}) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());
  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);
  const sm = useMedia("(max-width: 600px)");
  const md = useMedia("(max-width: 800px)");
  const lg = useMedia("(max-width: 1400px)");
  const bytesPerRow = sm ? 8 : md ? 12 : lg ? 16 : 32;
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
    style: {
      overflow: "auto"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      height: `${rowVirtualizer.totalSize}px`,
      position: "relative"
    }
  }, rowVirtualizer.virtualItems.map((virtualRow) => /* @__PURE__ */ React.createElement("div", {
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
  }))))));
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
const useMedia = (query) => {
  const media = useMemo(() => window.matchMedia(query), [query]);
  const [active, setActive] = useState(media.matches);
  useEffect(() => {
    const change = () => setActive(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, [media]);
  return active;
};
const HexPairs = ({u8, size}) => {
  const str = u8.reduce((acc, value) => {
    return acc + value.toString(16).padStart(2, "0") + " ";
  }, "");
  return str.padEnd(size * 3 - 1, "_");
};
const whitespace = /\W/g;
const Ascii = ({u8, size}) => {
  const str = u8.reduce((acc, value) => {
    return acc + String.fromCharCode(value);
  }, "");
  return str.replace(whitespace, "\xB7");
};
