importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js")

// 在這邊填寫快取部分

workbox.routing.registerRoute(
  /^https:\/\/code.jquery.com\/.*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'jquery-cache'
  })
)

workbox.routing.registerRoute(
  /^https:\/\/cdnjs.cloudflare.com\/.*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'cdnjs-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.json/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'json-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.js/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'js-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.css/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.png/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'png-cache'
  })
)
// cache index.html page
workbox.routing.registerRoute(
  /\/$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'index-cache'
  })
)

self.addEventListener('install', function() {
  // skipWaiting 可以跳過等待，直接套用最新的快取
  self.skipWaiting()
})

workbox.precaching.precacheAndRoute([{"revision":"5677a236c0efaf015ae6329169f76fb4","url":"_sw-mine.js"},{"revision":"730c6f1ebf1438d15078a4e4a087100b","url":"css/import-01.css"},{"revision":"63b559ea2a659becd2585ecb79a7d1ad","url":"img/test-192x192.png"},{"revision":"e32f439a9abb1b28d86c01cdce89db4c","url":"img/test-512x512.png"},{"revision":"c186c6fbd69429ecd13c5ad32f2c08c6","url":"index.html"},{"revision":"849a55f57a202aa695f686bd4d661c3a","url":"index.js"},{"revision":"76131693af2210c342d38f828d3864db","url":"js/import-01.js"},{"revision":"a08c58bae55105b76290a948fb764e4e","url":"js/import-02.js"},{"revision":"dce76cacffeb3c097eef729d16b79a63","url":"manifest.json"},{"revision":"cea8657aa1684f276410c340582cd7b5","url":"package-lock.json"},{"revision":"5ca6de7dc3bb59b449b18d552b04dff8","url":"package.json"},{"revision":"2cc7643f9c048aa0d7c3bc8d98289dc2","url":"server.js"},{"revision":"5f16c9f8b43f9d6f0c2dc15979e17ec4","url":"workbox-config-injectManifest.js"},{"revision":"17eb167fccc1e72b2fbe7d135bdad611","url":"workbox-config.js"}])