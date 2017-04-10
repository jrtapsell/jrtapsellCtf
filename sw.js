this.addEventListener('fetch', function(event) {
  console.log("SERVICE WORKER:", event, event.request.url);
  event.respondWith(
    fetch(event.request)
  );
});