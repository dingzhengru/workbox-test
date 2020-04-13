
console.log('Hello from sw.js')

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

console.log(workbox.strategies)

workbox.routing.registerRoute(
  /.*\.js/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'js-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.css/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'css-cache'
  })
)