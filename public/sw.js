// Minimal service worker for PWA installation
// No complex caching - just enough to be installable

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through all requests to network
  event.respondWith(fetch(event.request));
});
