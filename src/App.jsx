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

export const App = () => <Choose />;

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
                  ↓
                </a>

                <button onClick={close} title="Close file">
                  ⨯
                </button>
              </nav>
            </>
          )}
        </div>
      </header>

      {file && <Hex blob={file} />}
      {/* 
      <p>
        <a onClick={open}>open file</a>
      </p> */}
      {/* 
      <p>
        View content of a{" "}
        <a href="#!" onClick={open}>
          file
        </a>
        , <a href="#url">url</a> or <a href="#buffer">ArrayBuffer</a>
      </p>

      <section id="url">
        <h2>url</h2>
      </section>

      <section id="buffer">
        <h2>buffer</h2>
      </section> */}
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
