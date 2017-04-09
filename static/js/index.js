(function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/static/js/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
  
  var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    unsubscribe();
      if (user) {
        console.log(user);
        firebase.database().ref("/users/" + user.uid).set({
          image: user.photoURL,
          name: user.displayName,
          uid: user.uid
        });
        redirect_to_url();
      } else {
        load_login();
      }
  });
})();