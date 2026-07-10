const CACHE_NAME = 'admin-cache-v3';

// Incluímos a raiz do admin com a barra para passar no critério estrito do WebAPK
const urlsToCache = [
    '/admin/',
    '/admin/index.html',
    '/admin/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name.startsWith('admin-cache') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const reqUrl = new URL(event.request.url);

    // CRÍTICO: Se o Chrome pedir o start_url exato (/admin/), entregamos o index.html em cache.
    // Isso garante o Status 200 obrigatório para habilitar o botão "Instalar".
    if (reqUrl.pathname === '/admin' || reqUrl.pathname === '/admin/') {
        event.respondWith(
            caches.match('/admin/index.html').then(response => {
                return response || fetch(event.request);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});