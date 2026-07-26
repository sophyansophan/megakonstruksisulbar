const CACHE_NAME = 'mega-konstruksi-app2-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Service Worker dan caching resources (Menyimpan data ke memori HP)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept fetch requests (Menyediakan akses saat Offline)
self.addEventListener('fetch', event => {
  // Hanya cegat permintaan HTTP/S, biarkan ekstensi atau protokol lain lewat
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di memori cache HP, gunakan itu. 
        // Jika tidak, baru minta ke internet.
        return response || fetch(event.request).catch(() => {
          // Jika internet mati total, biarkan aplikasi tetap berjalan menggunakan cache
        });
      })
  );
});

// Update & Bersihkan Cache Lama (Agar saat Anda update codingan, HP pengguna otomatis terbarui)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
