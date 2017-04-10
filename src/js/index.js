(function() {
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