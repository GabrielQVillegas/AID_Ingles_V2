const CACHE="aid-ingles-v2.1";
const ASSETS=["./","./index.html","./manifest.json","./service-worker.js","./palabras_vocabulario_definitivo.json","./icon-192_V2.png","./icon-512_V2.png"];

self.addEventListener("install",e=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(r=>r||fetch(e.request))
);
});
