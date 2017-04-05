(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var currentUser = firebase.database().ref("/users/" + user.uid);
      console.log(user);
      currentUser.set({
        "uid": user.uid,
        "name": user.displayName,
        "last_login": Date(),
        "image": user.photoURL
      });
      redirect_to_url();
    } else {
      load_login();
    }
  });
})();