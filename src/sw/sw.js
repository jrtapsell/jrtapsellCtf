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

this.addEventListener('fetch', function (event) {
  var url = event.request.url;
  if (shouldCache(url)) {
    caches.open("CACHE").then(function (cache) {
      if (isPage(url)) {
        log('#0FF', "Cached page request for: " + url, event);
        return event.respondWith(cache.match('/'));
      } else {
        if (cache.match(url)) {
          log('#FF0', "Cached request for: " + url, event);
          return event.respondWith(cache.match(url))
        } else {
          log('#00F', "Caching request for: " + url, event);
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return event.respondWith(response);
          })
        }
      }
    })
  } else {
    log('#F0F', "Uncacheable request for: " + url, event);
    return event.respondWith(fetch(event.request));
  }
});