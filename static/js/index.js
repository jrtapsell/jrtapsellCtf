function update_user(user) {
  var database = firebase.database();
  database.ref("/users/" + user.uid).set({
    "uid": user.uid,
    "name": user.displayName,
    "last_login": Date()
  });
}
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