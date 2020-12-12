import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Hex } from "./Hex";
import { useDropzone } from "react-dropzone";

const blob = new Blob([
  "one",
  "two",
  2345,
  "and some other stuff here!!DSF",
  234,
]);

export const App = () => <Choose />;

const useObjectURL = (blob) => {
  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);

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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <main {...getRootProps()} className={isDragActive ? "dragging" : ""}>
      <header>
        <h1>Hex</h1>
        {file && (
          <>
            <p>{file.name}</p>
            <p>
              <a href={objectURL} download={file.name}>
                ↓
              </a>
            </p>
          </>
        )}
      </header>

      <input {...getInputProps()} />

      {file && <Hex blob={file || blob} />}
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
    </main>
  );
};
