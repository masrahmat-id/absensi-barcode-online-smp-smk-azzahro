const CACHE_NAME = 'offline-v1.0.4';
const OFFLINE_URL = './offline.html';
// Penambahan aset agar PWA cepat terdeteksi installable
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  './index.html',
  'logo-smp-azzahro.png',
  'logo-smk-azzahro.png',
  'https://github.com/masrahmat-id/absensi/raw/main/icon-absensi-azzahro%20(1).png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  console.log('Service Worker: Installed Version 1.0.1');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching critical assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Penambahan tahap Activate untuk pembersihan cache
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

// Tetap menggunakan logika Fetch asli Anda
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
