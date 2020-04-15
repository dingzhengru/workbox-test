# workbox-test


* Run this Test

```
npm install

npm start
```
## Workbox 快取策略
* 參考: https://developers.google.com/web/tools/workbox/modules/workbox-strategies
* StaleWhileRevalidate
* CacheFirst
* NetworkFirst
* NetworkOnly
* CacheOnly

## 快取筆記
*  快取更新的方式，是看 service-worker.js(sw.js) 檔案是否更新，且會根據 skipWaiting 設定決定是否馬上套用更新
*  是否馬上更新的條件是，現有工作線程控制零個客戶端(注意，在刷新期間客戶端會重疊)參考: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates
*  所以要讓用戶一直保持使用最新快取的話，需使用 self.skipWaiting() (sw.js)，使用 workbox的話要於設定開啟("skipWaiting": true)

## Service Worker 基本流程
*  參考: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
*  註冊 => 註冊成功 => 觸發 install 事件 => event.waitUntil() => activate => fetch
*  event.waitUntil() 可表安裝的持續時間 & 安裝是否成功，添加 cache 也是在此方法內實行
*  activate 事件，此事件開始後，代表可以開始處理 fetch
*  fetch 事件是攔截所有 request，且可以用 event.respondWith 方法將 cache 內的檔案 response 回原 request

```
self.addEventListener('install', event => {
  console.log('V1 installing…');

  // cache a cat SVG
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/cat.svg'))
  );
});

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 攔截 dog.svg 的請求，並用 cache 中 cat.svg 的替代掉
  // 原本是顯示狗的圖案，但若由 cache 拿取的話，就會是貓的圖案
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/cat.svg'));
  }
});
```

## Workbox Cli
*  文件: https://developers.google.com/web/tools/workbox/modules/workbox-cli
*  參數設定文件: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build
*  wizard: 按數個問題回答產生相應的 workbox-config.js(檔案名稱可自訂)
*  generateSW: Generates a complete service worker for you.
    *  You want to precache files.
    *  You have simple runtime configuration needs (e.g. the configuration allows you to define routes and strategies).
*  injectManifest: Injects the assets to precache into your project.
    *  You want more control over your service worker.
    *  You want to precache files.
    *  You have more complex needs in terms of routing.
    *  You would like to use your service worker with other API's (e.g. Web Push).
*  copyLibraries: Copy the Workbox libraries into a directory.
*  用於專案 build 可以將此命令跟原本的 bulid 命令結合

```npm install workbox-cli --global```

### generateSW
*  若沒有要設定 快取策略 或其他相關更詳細的設定用此就夠

```bash
# generateSW
workbox wizard
workbox generateSW path/to/config.js
```

### injectManifest
*  需詳細設定快取策略 或 其他詳細設定的話用此
*  需先創建一個 sw-config.js(自訂檔名)，在此檔案裡寫上自己的 sw.js 檔案的設定
*  但 sw-config.js 必須放上兩行代碼，第一行是引入 workbox，第二行是放 precache 的代碼
*  自己的設定寫在這兩行中間，沒有在策略中的快取檔案，會由最後一行的 precache 去存取

**sw-config.js**
```js 
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

// 在這兩行中間，寫自己的 workbox 設定

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)
```

```bash
# injectManifest
workbox wizard --injectManifest
workbox injectManifest path/to/config.js
```
### 將 workbox cli 運用於 app build 上
*  為了讓 app build 的時候能更新 sw.js，將命令結合即可
```js
// package.json
{
  "scripts": {
    "build": "my-build-script && workbox <mode> <path/to/config.js>"
  }
}
```
## 跨網域資源(cors)
*  需於 script 加上 ```crossorigin="anonymous"```

``` xml
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  crossorigin="anonymous"></script>
```

## fetch 通用寫法
*  從 cdn 這種寫法也能通
*  參考以前自己的練習: https://github.com/dingzhengru/Service-Worker-test/blob/master/service-worker.js
```js
self.addEventListener('fetch', event => {

  // const url = new URL(event.request.url)

  // 對此網域以外的資源(cors)
  // if(url.origin != location.origin){}

  event.respondWith(async function() {
      // 嘗試從 cache 找出對應的 response
      const cachedResponse = await caches.match(event.request)

      // 在 cache 有找到就回傳
      if (cachedResponse) {
        return cachedResponse
      }

      // 沒有找到就從原本的地方找
      return fetch(event.request)
  }())
})
```

## 自己用 workbox 寫的 sw.js

``` js
// _sw-mine.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

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
  new workbox.strategies.CacheFirst({
    cacheName: 'json-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.js/,
  new workbox.strategies.CacheFirst({
    cacheName: 'js-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.css/,
  new workbox.strategies.CacheFirst({
    cacheName: 'css-cache'
  })
)

workbox.routing.registerRoute(
  /.*\.png/,
  new workbox.strategies.CacheFirst({
    cacheName: 'png-cache'
  })
)
// cache index.html page
workbox.routing.registerRoute(
  /\/$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'index-cache'
  })
)

self.addEventListener('install', function() {
  // skipWaiting 可以跳過等待，直接套用最新的快取
  self.skipWaiting()
})

```