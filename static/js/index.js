(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  var first = true;
  firebase.auth().onAuthStateChanged(function (user) {
    if (first) {
      first = false;
      if (user) {
        redirect_to_url();
      } else {
        load_login();
      }
    }
  });
})();