import { useSyncExternalStore } from "react";

/* A media query as React state. False on the server, so the first render never assumes motion. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
