const CACHE = "aid-ingles-v2.2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./palabras_vocabulario_definitivo.json",
  "./icon-192_V2.png",
  "./icon-512_V2.png"
];

// Instala y guarda archivos base
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

// Activa y elimina cachés viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🔥 JSON siempre actualizado (network-first)
  if (url.pathname.includes("palabras_vocabulario_definitivo.json")) {
    event.respondWith(
      fetch(req)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE).then(cache => {
            cache.put(req, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 📦 Todo lo demás: cache-first
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(response => {
        const responseClone = response.clone();
        caches.open(CACHE).then(cache => {
          cache.put(req, responseClone);
        });
        return response;
      });
    })
  );
});