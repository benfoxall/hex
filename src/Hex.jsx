import React, { useEffect, useRef, useState } from "react";

export const Hex = ({ blob }) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());

  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);

  const BYTES = 16;

  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / BYTES);

  /*
  approach 
    - on resize (once)
    - check that we're within bounds
    - resize if necessary
  */

  return (
    <table>
      <tbody>
        {repeat(rows, (i) => {
          const l = Math.min(BYTES, buffer.byteLength - i * BYTES);
          const sub = new DataView(buffer, i * BYTES, l);

          return (
            <tr key={i}>
              <td>{(i * 4).toString(16).padStart(4, ".")}</td>

              <td>
                <HexPairs view={sub} />
              </td>

              <td>
                <Ascii view={sub} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const HexPairs = ({ view }) => {
  let acc = "";

  for (let i = 0; i < view.byteLength; i++) {
    acc += view.getUint8(i).toString(16).padStart(2, ".") + " ";
  }

  return acc;
};

const Ascii = ({ view }) => {
  let acc = "";

  for (let i = 0; i < view.byteLength; i++) {
    acc += String.fromCharCode(view.getUint8(i));
  }

  return acc;
};

function repeat(length, fn) {
  return Array.from({ length }, (_, i) => fn(i));
}
