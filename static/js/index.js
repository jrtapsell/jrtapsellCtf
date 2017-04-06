(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  var first = true;
  firebase.auth().onAuthStateChanged(function (user) {
    if (first) {
      first = false;
      if (user) {
        $(".mdl-layout__drawer-button").show();
        firebase.database().ref("/users/" + user.uid).set({
          "uid": user.uid,
          "name": user.displayName,
          "image": user.photoURL
        });
        load_index();
        
        var myConnectionsRef = firebase.database().ref("/users/" + user.uid + '/connections');
        var lastOnlineRef = firebase.database().ref("/users/" + user.uid + '/lastOnline');

        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', function(snap) {
          if (snap.val() === true) {
            var con = myConnectionsRef.push(true);
            con.onDisconnect().remove();
            lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
          }
        });
        redirect_to_url();
      } else {
        $(".mdl-layout__drawer-button").hide();
        load_login();
      }
    }
  });
})();