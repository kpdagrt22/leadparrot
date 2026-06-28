"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) at root scope after load. No-op
 * where the API is unavailable (SSR, older browsers). The SW itself is the
 * caching authority — this only wires it up.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* registration is best-effort; the app works without it */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
