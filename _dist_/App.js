import React, {useEffect, useMemo, useState, memo} from "../web_modules/react.js";
import {Hex as Hex2} from "./Hex.js";
import {useDropzone} from "../web_modules/react-dropzone.js";
const testfile = new File([
  "one",
  "two",
  2345,
  "and some other szfsdfdsafds!!DSF",
  "one",
  "two",
  2345,
  "and some other sdfsadfsdtuff here!!DSF",
  "one",
  "two",
  2345,
  "and some other szfsdfdsafds!!DSF",
  "one",
  "two",
  2345,
  "and some other sdfsadfsdtuff here!!DSF",
  "one",
  "two",
  2345,
  "and some other szfsdfdsafds!!DSF",
  "one",
  "two",
  2345,
  "and some other sdfsadfsdtuff here!!DSF",
  "one",
  "two",
  2345,
  "and some other szfsdfdsafds!!DSF",
  "one",
  "two",
  2345,
  "and some other sdfsadfsdtuff here!!DSF",
  "one",
  "two",
  2345,
  "and some other stuff here!!DSF",
  234
], "test-file.fob");
const useObjectURL = (blob) => {
  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  return url;
};
const ex = `
hex = window.open("http://localhost:8080/", 'hex', 'width=300');

hex.postMessage(new Uint8Array([1,2,3,4]), '*');
`;
export const App = () => {
  const [file, setFile] = useState();
  const objectURL = useObjectURL(file);
  const close = () => setFile(void 0);
  const onDrop = (files) => {
    setFile(files[0]);
  };
  useEffect(() => {
    const listen = (e) => {
      console.log(e);
      const data = e.data;
      const ab = data instanceof ArrayBuffer ? data : data.buffer instanceof ArrayBuffer ? data.buffer : null;
      if (ab) {
        setFile(new File([ab], `${e.origin}.data`));
      }
    };
    window.addEventListener("message", listen);
    return () => {
      window.removeEventListener("message", listen);
    };
  }, []);
  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });
  return /* @__PURE__ */ React.createElement("div", {
    ...getRootProps(),
    className: `draggable ${isDragActive ? "active" : ""}`
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Hex"), file && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, file.name, " ", /* @__PURE__ */ React.createElement(Size, {
    bytes: file.size
  })), /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("a", {
    href: objectURL,
    download: file.name,
    title: "Download content"
  }, "\u2193 Save"), /* @__PURE__ */ React.createElement("button", {
    onClick: close,
    title: "Close file"
  }, "Close"))))), file ? /* @__PURE__ */ React.createElement(Hex2, {
    blob: file
  }) : /* @__PURE__ */ React.createElement("section", {
    className: "info"
  }, /* @__PURE__ */ React.createElement("p", null, "A viewer for binary data"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    onClick: open
  }, "Select a local file")), /* @__PURE__ */ React.createElement("li", null, "Post an ArrayBuffer")), /* @__PURE__ */ React.createElement("code", null, /* @__PURE__ */ React.createElement("pre", null, ex))));
};
const units = ["byte", "kilobyte", "megabyte", "gigabyte"];
const Size = memo(({bytes}) => {
  let s = bytes;
  for (const unit of units) {
    if (s < 750) {
      return new Intl.NumberFormat("en", {
        style: "unit",
        unitDisplay: "narrow",
        unit
      }).format(Math.round(s));
    }
    s /= 1e3;
  }
  return "huge";
});
