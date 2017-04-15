console.colourLog = function (background, colour, text, data) {
  console.groupCollapsed("%c %c " + text, "background:" + background, ";color:" + colour);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};

function log(color, messageContents, data) {
  console.colourLog("#0F0", color, messageContents, data);
}

function shouldCache(url) {
  if (url.startsWith("https://ctf.jrtapsell.co.uk/")) {
    return true;
  }
  if (url.endsWith(".js")) {
    return true;
  }
  return false;
}

this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('CACHE').then(function (cache) {
      return cache.addAll([
        '/'
      ]);
    })
  );
});

function isPage(url) {
  return url.startsWith("https://ctf.jrtapsell.co.uk") && url.indexOf("static") == -1;
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
  })
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
  })
}

this.addEventListener('fetch', function (event) {
  if (shouldCache(event.request.url)) {
    event.respondWith(cacheable(event));
  } else {
    event.respondWith(uncacheable(event));
  }
});