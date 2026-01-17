const CACHE_NAME = 'offline-v1.0.4';
const OFFLINE_URL = './offline.html';
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  './index.html',
  'logo-smp-azzahro.png',
  'logo-smk-azzahro.png',
  'https://github.com/masrahmat-id/absensi/raw/main/icon-absensi-azzahro%20(1).png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  } else {
    e.respondWith(fetch(e.request));
  }
});
