(function() {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    unsubscribe();
      if (user) {
        redirect_to_url();
      } else {
        load_login();
      }
  });
})();