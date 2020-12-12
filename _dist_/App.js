import React, {useCallback, useEffect, useMemo, useState} from "../web_modules/react.js";
import {Hex as Hex2} from "./Hex.js";
import {useDropzone} from "../web_modules/react-dropzone.js";
const blob = new Blob([
  "one",
  "two",
  2345,
  "and some other stuff here!!DSF",
  234
]);
export const App = () => /* @__PURE__ */ React.createElement(Choose, null);
const useObjectURL = (blob2) => {
  const url = useMemo(() => blob2 && URL.createObjectURL(blob2), [blob2]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  return url;
};
const Choose = () => {
  const [file, setFile] = useState();
  const objectURL = useObjectURL(file);
  const onDrop = (files) => {
    console.log(files);
    setFile(files[0]);
  };
  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });
  return /* @__PURE__ */ React.createElement("main", {
    ...getRootProps(),
    className: isDragActive ? "dragging" : ""
  }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("h1", null, "Hex"), file && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, file.name), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", {
    href: objectURL,
    download: file.name
  }, "\u2193")))), /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), file && /* @__PURE__ */ React.createElement(Hex2, {
    blob: file || blob
  }));
};
