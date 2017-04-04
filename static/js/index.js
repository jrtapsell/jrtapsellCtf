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
      /*
      database.ref("/users/").on("value", function (data) {
        var stringify = JSON.stringify(data.val(), null, 4);
        var users = $("#users");
        users.text(stringify);
      });
      */
    } else {
      alert("Please log in");
      firebase.auth().signInWithPopup(provider);
    }
  });
})();