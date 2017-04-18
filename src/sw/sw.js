console.colourLog = function (background, colour, text, data) {
  console.groupCollapsed("%c %c " + text, "background:" + background, ";color:" + colour);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};

function log(color, messageContents, data) {
  console.colourLog("#0F0", color, messageContents, data);
}

const EXTENSION_WHITELIST = [".js", ".css", ".woff2"];
const DOMAIN_WHITELIST = ["ctf.jrtapsell.co.uk", "cdn.rawgit.com", "fonts.gstatic.com", "googleusercontent.com", "githubusercontent.com", "fonts.googleapis.com"];

function shouldCache(url) {
  
  for (let extension of EXTENSION_WHITELIST) {
    if (url.endsWith(extension)) {
      return true;
    }
  }

  for (let domain of DOMAIN_WHITELIST) {
    if (url.indexOf(domain) != -1) {
      return true;
    }
  }
  return false;
}

self.addEventListener('activate', function (event) {
  log("#0F0", "Service worker active", event);
  return self.clients.claim();
});

this.addEventListener('install', function (event) {
  log("#0F0", "Service worker installed", event);
  event.waitUntil(
    caches.delete('CACHE').then(function (_) {
      log("#0F0", "Deleted old cache");
      return caches.open('CACHE').then(function (cache) {
        log("#0F0", "Armed cache");
        return cache.addAll([
          '/'
        ]);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

function isPage(url) {
  return url.startsWith("https://ctf.jrtapsell.co.uk") && url.indexOf("static") == -1 && !url.endsWith("sw.js") && !url.endsWith("sw-installer.js");
}

function uncacheable(event) {
  log('#F0F', "Uncacheable request for: " + event.request.url, event);
  return fetch(event.request);
}
function page(event, cache) {
  log('#0FF', "Cached page request for: " + event.request.url, event);
  return cache.match('/');
}
function cached(event, cache) {
  log('#FF0', "Cached request for: " + event.request.url, event);
  return cache.match(event.request.url);
}

function uncached(event, cache ) {
  log('#00F', "Caching request for: " + event.request.url, event);
  return fetch(event.request).then(function (response) {
    cache.put(event.request, response.clone());
    return response;
  });
}
function cacheable(event) {
  return caches.open("CACHE").then(function (cache) {
    if (isPage(event.request.url)) {
      return page(event, cache);
    } else {
      return cache.match(event.request.url).then(function (response) {
        if (response) {
          return cached(event, cache );
        } else {
          return uncached(event, cache );
        }
      });
    }
  });
}

this.addEventListener('fetch', function (event) {
  if (shouldCache(event.request.url)) {
    event.respondWith(cacheable(event));
  } else {
    event.respondWith(uncacheable(event));
  }
});