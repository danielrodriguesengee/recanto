const CACHE_NAME = 'admin-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting(); // Força a instalação sem esperar
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Exige o controle das abas ativas
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});