const CACHE_NAME = 'irsyadululum-v7';
const STATIC_ASSETS = [
  './', './login.html', './index.html', './admin.html', './parent.html', './seed.js', './notif.js', './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Amiri:wght@700&display=swap',
  'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_ASSETS.map(u => cache.add(u).catch(()=>{}))))
    .then(() => self.skipWaiting())
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('/api/')) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res && res.status === 200 && res.type !== 'opaque') {
      const clone = res.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    }
    return res;
  }).catch(() => caches.match(e.request).then(c => c || caches.match('./login.html'))));
});
