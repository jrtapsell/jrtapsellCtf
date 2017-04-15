
function log(color, messageContents, data) {
  console.colourLog("#336", color, messageContents, data);
}

navigator.serviceWorker.register('/sw.js').then(function(registration) {
  // Registration was successful
  log('#F00', 'ServiceWorker registration successful',registration.scope);
}).catch(function(err) {
  // registration failed :(
  log('#F00', 'ServiceWorker registration failed: ' + err);
});