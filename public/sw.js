/* The Leads Nest — service worker.
 *
 * SAFETY + CORRECTNESS CONTRACT:
 *  - Cache-first ONLY for the app shell + static assets (/_next/static, icons,
 *    fonts, the demo/landing shell). These carry no per-user data.
 *  - Network-first and NEVER cached for every /api/* and /auth/* request — those
 *    are RLS-scoped/authenticated and must always be fresh.
 *  - Non-GET requests (mutations) are never intercepted.
 *  - Versioned cache name + SKIP_WAITING message = kill switch: bump VERSION (or
 *    unregister) to purge a bad worker on next load.
 */
const VERSION = "tln-v1";
const SHELL = VERSION + "-shell";

// Zero-secrets demo shell precache (no authenticated routes — /app is auth-gated
// and intentionally excluded so we never cache a redirect/login as the app).
const PRECACHE = ["/", "/demo", "/offline", "/icons/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never touch mutations
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never cache cross-origin

  // Network-first, NEVER cache: authenticated + RLS-scoped responses.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    event.respondWith(fetch(req).catch(() => caches.match("/offline")));
    return;
  }

  // Navigations: network-first, fall back to cached page, then offline shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("/offline"))),
    );
    return;
  }

  // Static assets: cache-first.
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|ttf|svg|png|jpg|jpeg|gif|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then(
        (m) =>
          m ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
  }
});
