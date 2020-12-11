import React, { useEffect, useState } from "react";

export const Hex = ({ blob }) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());

  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);

  console.log(buffer);

  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / 4);

  return (
    <table>
      <colgroup>
        <col className="address" />
        <col span="4" className="byte" />
        <col span="4" className="ascii" />
      </colgroup>
      <tbody>
        {repeat(rows, (i) => (
          <tr key={i}>
            <td>{(i * 4).toString(16).padStart(4, ".")}</td>

            <td>
              <Byte view={view} offset={i * 4} />
            </td>
            <td>
              <Byte view={view} offset={i * 4 + 1} />
            </td>
            <td>
              <Byte view={view} offset={i * 4 + 2} />
            </td>
            <td>
              <Byte view={view} offset={i * 4 + 3} />
            </td>

            <td>
              <Ascii view={view} offset={i * 4} />
            </td>
            <td>
              <Ascii view={view} offset={i * 4 + 1} />
            </td>
            <td>
              <Ascii view={view} offset={i * 4 + 2} />
            </td>
            <td>
              <Ascii view={view} offset={i * 4 + 3} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Byte = ({ view, offset }) => {
  if (view.byteLength > offset) {
    return view.getUint8(offset).toString(16).padStart(2, ".");
  } else {
    return "__";
  }
};

const Ascii = ({ view, offset }) => {
  if (view.byteLength > offset) {
    return String.fromCharCode(view.getUint8(offset));
  } else {
    return "_";
  }
};

function repeat(length, fn) {
  return Array.from({ length }, (_, i) => fn(i));
}
