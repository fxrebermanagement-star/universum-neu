/* Universum Neu service worker — caches by VERSION, no wipe on every load */
const VERSION = "1.0.0";
const CACHE = "universum-neu-" + VERSION;

const SHELL = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/version.js",
  "./js/util.js",
  "./js/storage.js",
  "./js/data/rituals.js",
  "./js/data/fest.js",
  "./js/cards.js",
  "./js/sigil.js",
  "./js/screens.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/rune.svg",
  "./content/pdfpart0.txt",
  "./content/pdfpart1.txt",
  "./content/pdfpart2.txt",
  "./content/pdfpart3.txt",
  "./content/pdfpart4.txt",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("universum-neu-") && k !== CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok && req.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    })
  );
});
