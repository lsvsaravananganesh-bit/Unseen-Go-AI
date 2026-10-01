/* UnseenGo AI — Service Worker (PWA)
 * Cache Strategy:
 *   - App Shell (CSS/JS): Cache-First
 *   - HTML Pages: Network-First with cache fallback
 *   - Offline Fallback: Served from cache when network unavailable
 */

const CACHE_NAME = 'unseengo-v1';

/* App shell assets to pre-cache on install */
const APP_SHELL = [
  '/',
  '/index.html',
  '/discover.html',
  '/planner.html',
  '/my-travel.html',
  '/search.html',
  '/styles.css',
  '/src/styles/heritage-theme.css',
  '/src/styles/navigation.css',
  '/src/styles/components.css',
  '/src/scripts/navigation.js',
  '/src/scripts/ai-widget.js',
  '/app.js',
  '/manifest.json'
];

/* Inline offline fallback page */
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UnseenGo AI — You're Offline</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
         background:#080d09;color:#f5f7f3;font-family:system-ui,sans-serif;padding:2rem;text-align:center}
    .card{max-width:480px;background:#101611;border:1px solid #1e2820;border-radius:24px;padding:3rem 2rem}
    .icon{font-size:4rem;margin-bottom:1.5rem}
    h1{font-size:1.8rem;margin-bottom:0.75rem;color:#f5f7f3}
    p{color:#9cb4a2;line-height:1.6;margin-bottom:1.75rem}
    a{display:inline-block;background:#d8ff4d;color:#080d09;font-weight:800;
      padding:0.75rem 2rem;border-radius:999px;text-decoration:none;transition:opacity 0.2s}
    a:hover{opacity:0.85}
    .badge{display:inline-block;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;
           color:#6a7b70;margin-bottom:1rem;text-transform:uppercase}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✈️</div>
    <div class="badge">✦ UnseenGo AI</div>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection. Check your network and try again to continue discovering India's hidden gems.</p>
    <a href="/" onclick="location.reload();return false;">Try Again</a>
  </div>
</body>
</html>`;

/* ── Install: pre-cache app shell ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL);
      } catch (err) {
        // Non-fatal: some shell assets may not exist yet
        console.warn('[SW] App shell pre-cache partially failed:', err);
      }
      // Cache offline fallback page as a special entry
      await cache.put('/__offline', new Response(OFFLINE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }));
    })
  );
  self.skipWaiting();
});

/* ── Activate: clean up stale caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: routing strategy ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Determine asset type
  const isHTML = request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html') || url.pathname === '/';
  const isStaticAsset = /\.(css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/i.test(url.pathname);

  if (isStaticAsset) {
    // Cache-First strategy for CSS/JS/images
    event.respondWith(cacheFirst(request));
  } else if (isHTML) {
    // Network-First strategy for HTML pages
    event.respondWith(networkFirst(request));
  }
  // For all other requests (API, etc.) — let browser handle normally
});

/* Cache-First: serve from cache, fallback to network then cache result */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Asset not available offline.', { status: 503 });
  }
}

/* Network-First: try network, fall back to cache, then offline page */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Serve the offline fallback
    const offlinePage = await caches.match('/__offline');
    return offlinePage || new Response('<h1>You are offline</h1>', {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}