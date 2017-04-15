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

function getResponse(request) {
  var url = request.url;
  if (shouldCache(url)) {
    return caches.open("CACHE").then(function (cache) {
      if (isPage(url)) {
        log('#0FF', "Cached page request for: " + url, request);
        return cache.match('/');
      } else {
        if (cache.match(url)) {
          log('#FF0', "Cached request for: " + url, request);
          return cache.match(url);
        } else {
          log('#00F', "Caching request for: " + url, request);
          return fetch(request).then(function (response) {
            cache.put(request, response.clone());
            return response;
          })
        }
      }
    })
  } else {
    log('#F0F', "Uncacheable request for: " + url, request);
    return fetch(request);
  }
}

this.addEventListener('fetch', function (event) {
  event.respondWith(getResponse(event.request));
});