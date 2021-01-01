import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Hex } from "./Hex";
import { Usage } from "./Usage";
import { ByteSize, useObjectURL } from "./util";

// const d = new File([Uint8Array.from({ length: 256 }, (_, i) => i)], "dev.data");

export const App = () => {
  const [file, setFile] = useState();
  const objectURL = useObjectURL(file);
  const close = () => {
    setFile(void 0);

    // close the window if it was openned by script
    // fixme:? check if target="foo"
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
      } else {
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const demo = (e) => {
    e.preventDefault();
    fetch(e.target.href)
      .then((res) => res.arrayBuffer())
      .then((buff) => new File([buff], e.target.name))
      .then(setFile);
  };

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
                {file.name} <ByteSize bytes={file.size} />
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
        window.opener === null && (
          <section className="info">
            <p>Another online hex viewer</p>

            <ul>
              <li>
                <a onClick={open} href="#">
                  Choose a file
                </a>
              </li>
              <li>
                <a onClick={toggleShowUsage} href="#">
                  From your JS ✨
                </a>
              </li>
            </ul>
            {showUsage && <Usage />}
            <p>
              Sample files:{" "}
              <a onClick={demo} name="index.html" href=".">
                html
              </a>{" "}
              <a
                onClick={demo}
                name="example.gif"
                href="https://benjaminbenben.com/img/example.gif"
              >
                gif
              </a>
            </p>
          </section>
        )
      )}
    </div>
  );
};
