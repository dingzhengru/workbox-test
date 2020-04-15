# workbox-test


* Run this Test

```
npm install

npm start
```

## 快取筆記
*  主動偵測並更新快取，參考: https://stackoverflow.com/questions/54145735/vue-pwa-not-getting-new-content-after-refresh
*  workbox 參數說明參考: https://letswrite.tw/pwa-workbox-params/
*  快取更新的方式，是看 service-worker.js(sw.js) 檔案是否更新，且會根據 skipWaiting 設定決定是否馬上套用更新
*  是否馬上更新的條件是，現有工作線程控制零個客戶端(注意，在刷新期間客戶端會重疊)參考: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates
*  所以要讓用戶一直保持使用最新快取的話，需使用 self.skipWaiting() (sw.js)，使用 workbox的話要於設定開啟("skipWaiting": true)

## Workbox Cli
*  文件: https://developers.google.com/web/tools/workbox/modules/workbox-cli
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

```bash
npm install workbox-cli --global

# generateSW
workbox wizard
workbox generateSW path/to/config.js

# injectManifest
workbox injectManifest path/to/config.js
```