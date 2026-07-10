const CACHE_NAME = 'admin-cache-v1';
const urlsToCache = [
    '/admin/',
    '/admin/index.html',
    '/admin/manifest.json'
];

// Instala o Service Worker e guarda arquivos básicos em cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Ativa e assume o controle imediatamente
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Escuta as requisições de rede (Obrigatório para o PWA instalável no Android)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});