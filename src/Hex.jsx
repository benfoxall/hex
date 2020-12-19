import React, { useEffect, useState, memo } from "react";
import { useVirtual } from "react-virtual";

const MemoRow = memo(({ index, buffer, bytesPerRow }) => {
  const byteOffset = index * bytesPerRow;

  const l = Math.min(bytesPerRow, buffer.byteLength - index * bytesPerRow);
  const u8 = new Uint8Array(buffer, byteOffset, l);

  return (
    <div className="row">
      <div>{(index * 4).toString(16).padStart(4, ".")}</div>

      <div>
        <HexPairs u8={u8} />
      </div>

      <div>
        <Ascii u8={u8} />
      </div>
    </div>
  );
});

export const Hex = ({ blob }) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());

  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);

  // How many bytes should be displayed in a single row
  // todo: update by screen width
  const bytesPerRow = 16;

  /*
  approach 
    - on resize (once)
    - check that we're within bounds
    - resize if necessary
  */

  const view = new DataView(buffer);
  const rows = Math.ceil(view.byteLength / bytesPerRow);

  const parentRef = React.useRef();

  const rowVirtualizer = useVirtual({
    size: rows,
    parentRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 5,
  });

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `200px`,
          width: `800px`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MemoRow
                index={virtualRow.index}
                buffer={buffer}
                bytesPerRow={bytesPerRow}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const HexPairs = ({ u8 }) => {
  return u8.reduce((acc, value) => {
    return acc + value.toString(16).padStart(2, "0") + " ";
  }, "");
};

const Ascii = ({ u8 }) => {
  return u8.reduce((acc, value) => {
    return acc + String.fromCharCode(value);
  }, "");
};
