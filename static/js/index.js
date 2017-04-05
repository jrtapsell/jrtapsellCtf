(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      update_user(user);
      redirect_to_url();
    } else {
      redirect_to_login();
    }
  });
})();