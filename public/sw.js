// Service Worker for Tujitume Progressive Web App
// Bump the cache name to force an update when this file changes
const CACHE_NAME = 'tujitume-v3';
const GIGS_CACHE = 'tujitume-gigs-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy for static assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Vite dev server requests (HMR and modules)
  if (url.pathname.includes('@vite') || url.pathname.includes('@react-refresh') || url.pathname.includes('.jsx')) {
    return;
  }

  // Navigation requests (e.g., SPA routes) - use network-first to avoid
  // serving stale index.html that can cause reload loops after deploys
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Cache a fresh copy of the shell for offline
          const cache = await caches.open(CACHE_NAME);
          cache.put('/', networkResponse.clone());
          return networkResponse;
        } catch (err) {
          // If offline, try cached shell, then offline fallback
          const cachedShell = await caches.match('/index.html') || await caches.match('/');
          if (cachedShell) return cachedShell;
          const offline = await caches.match('/offline.html');
          return offline || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // API requests - network first with offline support
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses, especially gigs
          if (response.ok) {
            const responseToCache = response.clone();
            const cacheName = url.pathname.includes('/gigs') ? GIGS_CACHE : CACHE_NAME;
            caches.open(cacheName).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          // Return cached response if network fails
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Silently fail for dev assets
          return new Response('Offline', { status: 503 });
        });
    })
  );
});
