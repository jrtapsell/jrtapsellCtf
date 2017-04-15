console.colourLog = function (background, colour, text, data) {
  console.groupCollapsed("%c %c " + text, "background:" + background, ";color:" + colour);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};

function log(color, messageContents, data) {
  console.colourLog("#0F0", color, messageContents, data);
}

this.addEventListener('fetch', function(event) {
  log('#0F0', "Request for: " + event.request.url, event);
  event.respondWith(
    fetch(event.request)
  );
});