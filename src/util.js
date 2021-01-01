import { useEffect, useMemo, useState, memo } from "react";

export const useObjectURL = (blob) => {
  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);

  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  return url;
};

export const useMedia = (query) => {
  const media = useMemo(() => window.matchMedia(query), [query]);
  const [active, setActive] = useState(media.matches);

  useEffect(() => {
    const change = () => setActive(media.matches);

    media.addEventListener("change", change);

    return () => media.removeEventListener("change", change);
  }, [media]);

  return active;
};

const units = ["byte", "kilobyte", "megabyte", "gigabyte"];
export const ByteSize = memo(({ bytes }) => {
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
