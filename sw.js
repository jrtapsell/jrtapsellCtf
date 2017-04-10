this.addEventListener('fetch', function(event) {
  console.log("SERVICE WORKER:", event);
  event.respondWith(
    fetch(event.request)
  );
});