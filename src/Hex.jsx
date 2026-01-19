import React, { useEffect, useState, memo } from "react";
import { useMedia } from "./util";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Hex = ({ blob }) => {
  const [buffer, setBuffer] = useState(new ArrayBuffer());

  useEffect(() => {
    blob.arrayBuffer().then(setBuffer);
  }, [blob]);

  const sm = useMedia("(max-width: 800px)");
  const md = useMedia("(max-width: 800px)");
  const lg = useMedia("(max-width: 1400px)");

  // How many bytes should be displayed in a single row
  const bytesPerRow = sm ? 8 : md ? 12 : lg ? 16 : 32;

  const view = new DataView(buffer);
  const size = Math.ceil(view.byteLength / bytesPerRow);

  const parentRef = React.useRef();

  const virtualizer = useVirtualizer({
    count: size,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
    overscan: 5,
    initialRect: { width: 1000, height: 1000 },
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <main ref={parentRef} style={{ overflow: 'auto', flex: 1 }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: "relative",
        }}
      >
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Row
              index={virtualRow.index}
              buffer={buffer}
              bytesPerRow={bytesPerRow}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

const Row = memo(({ index, buffer, bytesPerRow }) => {
  const byteOffset = index * bytesPerRow;

  const l = Math.min(bytesPerRow, buffer.byteLength - index * bytesPerRow);
  const u8 = new Uint8Array(buffer, byteOffset, l);

  return (
    <div className="row">
      <div>{(index * bytesPerRow).toString(16).padStart(4, ".")}</div>

      <div>
        <HexPairs u8={u8} size={bytesPerRow} />
      </div>

      <div>
        <Ascii u8={u8} size={bytesPerRow} />
      </div>
    </div>
  );
});

const HexPairs = ({ u8, size }) => {
  const str = u8.reduce((acc, value) => {
    return acc + value.toString(16).padStart(2, "0") + " ";
  }, "");

  return str.padEnd(size * 3 - 1, "_");
};

const Ascii = ({ u8 }) =>
  Array.from(u8, (value) =>
    value < 33 ||
    value == 0x7f ||
    value === 173 ||
    (value >= 129 && value <= 159)
      ? "."
      : String.fromCharCode(value)
  ).join("");
