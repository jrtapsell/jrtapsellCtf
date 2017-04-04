(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var database = firebase.database();
      database.ref("/users/" + user.uid).set({
        "uid": user.uid,
        "name": user.displayName,
        "last_login": Date()
      });
    } else {
      alert("Please log in");
      firebase.auth().signInWithPopup(provider);
    }
  });
})();