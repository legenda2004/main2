const CACHE_NAME = 'zhguchie-tours-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/responsive.css',
    '/js/app.js',
    '/images/logo.png',
    '/images/icon-hot.png',
    '/images/icon-search.png',
    '/images/icon-special.png',
    '/images/icon-profile.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});