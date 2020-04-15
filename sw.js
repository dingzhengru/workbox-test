/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./sw.js",['./workbox-ad578afd'], function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  workbox.skipWaiting();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "_sw-mine.js",
    "revision": "d9f68e014604f86a0c2f5010409d5284"
  }, {
    "url": "css/import-01.css",
    "revision": "730c6f1ebf1438d15078a4e4a087100b"
  }, {
    "url": "img/test-192x192.png",
    "revision": "63b559ea2a659becd2585ecb79a7d1ad"
  }, {
    "url": "img/test-512x512.png",
    "revision": "e32f439a9abb1b28d86c01cdce89db4c"
  }, {
    "url": "index.html",
    "revision": "8ec64cdfbeac61691d2b68134b09e751"
  }, {
    "url": "index.js",
    "revision": "849a55f57a202aa695f686bd4d661c3a"
  }, {
    "url": "js/import-01.js",
    "revision": "76131693af2210c342d38f828d3864db"
  }, {
    "url": "manifest.json",
    "revision": "dce76cacffeb3c097eef729d16b79a63"
  }, {
    "url": "package-lock.json",
    "revision": "cea8657aa1684f276410c340582cd7b5"
  }, {
    "url": "package.json",
    "revision": "87554b67dd8e509f4baecff94a3fe3f2"
  }, {
    "url": "server.js",
    "revision": "2cc7643f9c048aa0d7c3bc8d98289dc2"
  }], {});

});
//# sourceMappingURL=sw.js.map


self.addEventListener('install', event => {
  console.log('installing')

  event.waitUntil(
    caches.open('jquery-cache').then(cache => cache.add('https://code.jquery.com/jquery-3.4.1.min.js'))
  )
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  console.log(url.origin, url.pathname)

  // 對此網域以外的資源(cors)
  if(url.origin != location.origin) {

    console.log('fetch cors')

    // 這種寫法，對 cors 的也OK
    event.respondWith(async function() {
        // Try to get the response from a cache.
        const cachedResponse = await caches.match(event.request)
        // Return it if we found one.
        if (cachedResponse) {
          console.log('cache success', cachedResponse)
          return cachedResponse
        }

        console.log('cache fail')

        // If we didn't find a match in the cache, use the network.
        return fetch(event.request)
    }())
  }
})