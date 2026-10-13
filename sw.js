// Verhoog dit versienummer bij elke update, zodat je mobiel de nieuwe versie ophaalt.
// Let op: alle apps op jvvliet1999.github.io delen dezelfde offline-opslag.
// POP ruimt daarom alleen zijn EIGEN caches op (namen die met "pop-" beginnen).
const PREFIX = 'pop-';
const CACHE = PREFIX + 'v19';
const BESTANDEN = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Eerst netwerk (zodat updates direct binnenkomen), offline terugvallen op POP's eigen cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const kopie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, kopie)); return r; })
      .catch(() => caches.open(CACHE).then(c => c.match(e.request)))
  );
});
