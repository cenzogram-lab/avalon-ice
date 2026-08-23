import { useEffect, useState } from "react";

/**
 * Tracks whether the viewport is below `breakpoint`.
 *
 * The initial value is read synchronously so the first render is already
 * correct (no flash of the wrong layout), and updates come from a
 * matchMedia listener, which also fires on orientation changes.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = (e: MediaQueryList | MediaQueryListEvent) =>
      setIsMobile(e.matches);
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
