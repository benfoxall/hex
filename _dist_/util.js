import { useEffect, useMemo, useState, memo } from "../web_modules/react.js";
import prettyBytes from "../web_modules/pretty-bytes.js";

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

export const ByteSize = memo(({ bytes }) => prettyBytes(bytes));
