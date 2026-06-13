import { useSyncExternalStore } from "react";

function getServerSnapshot() {
  return false;
}

function getMediaSnapshot(query: string) {
  return () => window.matchMedia(query).matches;
}

function subscribeMediaQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    getMediaSnapshot(query),
    getServerSnapshot
  );
}
