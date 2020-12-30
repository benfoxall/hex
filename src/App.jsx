import React, { useEffect, useMemo, useState, memo } from "react";
import { Hex } from "./Hex";
import { useDropzone } from "react-dropzone";

const testfile = new File(
  [
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
    234,
  ],
  "test-file.fob"
);

const useObjectURL = (blob) => {
  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);

  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  return url;
};

// use a link element to get the full href
const help = document.createElement("a");
help.href = "help.js";

const ex = `const hex = await import(${JSON.stringify(help.href)})

hex.view(new Uint8Array([1, 2, 3, 4]))`;

export const App = () => {
  const [file, setFile] = useState();
  const objectURL = useObjectURL(file);
  const close = () => setFile(void 0);

  const [shown, setShown] = useState(false);
  const toggleJS = () => setShown((x) => !x);

  const onDrop = (files) => {
    setFile(files[0]);
  };

  useEffect(() => {
    const listen = (e) => {
      console.log(e);
      const data = e.data;

      const ab =
        data instanceof ArrayBuffer
          ? data
          : data.buffer instanceof ArrayBuffer
          ? data.buffer
          : null;

      if (ab) {
        setFile(new File([ab], `${e.origin}.data`));
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`draggable ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />

      <header>
        <div>
          <h1>Hex</h1>
          {file && (
            <>
              <p>
                {file.name} <Size bytes={file.size} />
              </p>
              <nav>
                <a
                  href={objectURL}
                  download={file.name}
                  title="Download content"
                >
                  ↓ Save
                </a>

                <button onClick={close} title="Close file">
                  Close
                </button>
              </nav>
            </>
          )}
        </div>
      </header>

      {file ? (
        <Hex blob={file} />
      ) : (
        <section className="info">
          <p>A viewer for binary data</p>

          <ul>
            <li>
              <a onClick={open} href="#">Select a local file</a>
            </li>
            <li>
              <a onClick={toggleJS} href="#">Send from JS</a>
            </li>
          </ul>
          {shown && (
            <code>
              <pre>{ex}</pre>
            </code>
          )}
        </section>
      )}
    </div>
  );
};

const units = ["byte", "kilobyte", "megabyte", "gigabyte"];
const Size = memo(({ bytes }) => {
  let s = bytes;

  for (const unit of units) {
    if (s < 750) {
      return new Intl.NumberFormat("en", {
        style: "unit",
        unitDisplay: "narrow",
        unit,
      }).format(Math.round(s));
    }

    s /= 1000;
  }

  return "huge";
});
