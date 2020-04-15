
console.log('Hello from sw.js 123')

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

// workbox.setConfig({ debug: false})

// console.log(workbox.strategies)

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

self.addEventListener('install', function() {
  console.log('self addEventListener: install')

  // skipWaiting 可以跳過等待，直接套用最新的快取
  self.skipWaiting()
})

// self.addEventListener('activate', function() {
//   // console.log('self addEventListener: activate')
//   // self.skipWaiting()
// })

// self.addEventListener('fetch', event => {
//   // console.log('self addEventListener: fetch', event)
// })
