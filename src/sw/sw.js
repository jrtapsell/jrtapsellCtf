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
  log('#F0F', "Uncacheable request for: " + request.url, request);
  event.respondWith(fetch(request));
}
function page(event, cache) {
  log('#0FF', "Cached page request for: " + event.request.url, event);
  event.respondWith(cache.match('/'));
}
function cached(event, cache) {
  log('#FF0', "Cached request for: " + event.request.url, event);
  event.respondWith(cache.match(event.request.url));
}

function uncached(event, cache ) {
  log('#00F', "Caching request for: " + event.request.url, event);
  return fetch(event.request).then(function (response) {
    cache.put(event.request, response.clone());
    event.respondWith(response);
  })
}
function cacheable(event) {
  caches.open("CACHE").then(function (cache) {
    if (isPage(event.request.url)) {
      page(event, cache);
    } else {
      if (cache.match(request.url)) {
        cached(event, cache );
      } else {
        uncached(event, cache );
      }
    }
  })
}
function generalRespond(event) {
  if (shouldCache(event.request.url)) {
    cacheable(event);
  } else {
    uncacheable(event);
  }
}

this.addEventListener('fetch', function (event) {
  if (shouldCache(event.request.url)) {
    cacheable(event);
  } else {
    uncacheable(event);
  }
});