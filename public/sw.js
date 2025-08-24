// public/sw.js
const CACHE_NAME = 'inkspire-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Devuelve el recurso en cache o haz la petición
          return response || fetch(event.request);
        })
    );
  }
});