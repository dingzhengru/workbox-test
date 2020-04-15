importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

const sw_version = '1.0.1'

// workbox.setConfig({ debug: false})

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
