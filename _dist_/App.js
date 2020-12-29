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
export const App = () => /* @__PURE__ */ React.createElement(Choose, null);
const useObjectURL = (blob) => {
  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  return url;
};
const Choose = () => {
  const [file, setFile] = useState(testfile);
  const objectURL = useObjectURL(file);
  const close = () => setFile(void 0);
  const onDrop = (files) => {
    setFile(files[0]);
  };
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
  }, "\u2193"), /* @__PURE__ */ React.createElement("button", {
    onClick: close,
    title: "Close file"
  }, "\u2A2F"))))), file && /* @__PURE__ */ React.createElement(Hex2, {
    blob: file
  }));
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
