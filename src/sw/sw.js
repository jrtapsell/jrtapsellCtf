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

function uncacheable(request, respond) {
  log('#F0F', "Uncacheable request for: " + request.url, request);
  respond(fetch(request));
}
function page(request, respond, cache) {
  log('#0FF', "Cached page request for: " + request.url, request);
  respond(cache.match('/'));
}
function cached(request, respond, cache) {
  log('#FF0', "Cached request for: " + request.url, request);
  respond(cache.match(request.url));
}
function uncached(request, respond, cache ) {
  log('#00F', "Caching request for: " + request.url, request);
  return fetch(request).then(function (response) {
    cache.put(request, response.clone());
    respond(response);
  })
}
function cacheable(request, respond) {
  caches.open("CACHE").then(function (cache) {
    if (isPage(request.url)) {
      respond(page(request, respond, cache));
    } else {
      if (cache.match(request.url)) {
        cached(request, respond, cache );
      } else {
        uncached(request, respond, cache );
      }
    }
  })
}
function generalRespond(request, respond) {
  if (shouldCache(request.url)) {
    cacheable(request, respond);
  } else {
    uncacheable(request, respond);
  }
}

this.addEventListener('fetch', function (event) {
  generalRespond(event.request, event.respondWith);
});