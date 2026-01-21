import React, {useEffect, useState} from "../web_modules/react.js";
import {useDropzone} from "../web_modules/react-dropzone.js";
import {Hex} from "./Hex.js";
import {Usage} from "./Usage.js";
import {ByteSize, useObjectURL} from "./util.js";
export const App = () => {
  const [file, setFile] = useState();
  const objectURL = useObjectURL(file);
  const close = () => {
    setFile(void 0);
    if (window.opener !== null) {
      window.close();
    }
  };
  const [showUsage, setShowUsage] = useState(false);
  const toggleShowUsage = (e) => setShowUsage((x) => !x);
  const onDrop = (files) => {
    setFile(files[0]);
  };
  useEffect(() => {
    const listen = (e) => {
      if (e.data instanceof ArrayBuffer) {
        setFile(new File([e.data], `${e.origin}.data`));
      } else if (e.data !== "ready") {
        console.warn("Unhandled messsage", e.data);
      }
    };
    window.addEventListener("message", listen);
    if (window.opener) {
      window.opener.postMessage("ready", "*");
    }
    return () => {
      window.removeEventListener("message", listen);
    };
  }, []);
  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });
  const demo = (e) => {
    e.preventDefault();
    fetch(e.target.href).then((res) => res.arrayBuffer()).then((buff) => new File([buff], e.target.name)).then(setFile);
  };
  return /* @__PURE__ */ React.createElement("div", {
    ...getRootProps(),
    className: `draggable ${isDragActive ? "active" : ""}`
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Hex"), file && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, file.name, " ", /* @__PURE__ */ React.createElement(ByteSize, {
    bytes: file.size
  })), /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("a", {
    href: objectURL,
    download: file.name,
    title: "Download content"
  }, "\u2193 Save"), /* @__PURE__ */ React.createElement("button", {
    onClick: close,
    title: "Close file"
  }, "Close"))))), file ? /* @__PURE__ */ React.createElement(Hex, {
    blob: file
  }) : window.opener === null && /* @__PURE__ */ React.createElement("section", {
    className: "info"
  }, /* @__PURE__ */ React.createElement("p", null, "Another online hex viewer"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    onClick: open,
    href: "#"
  }, "Open a file")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    onClick: toggleShowUsage,
    href: "#"
  }, "Via browser console \u2728"))), showUsage && /* @__PURE__ */ React.createElement(Usage, null), /* @__PURE__ */ React.createElement("p", null, "Sample files:", " ", /* @__PURE__ */ React.createElement("a", {
    onClick: demo,
    name: "index.html",
    href: "."
  }, "html"), " ", /* @__PURE__ */ React.createElement("a", {
    onClick: demo,
    name: "example.gif",
    href: "https://benjaminbenben.com/img/example.gif"
  }, "gif"))));
};
