(function() {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    unsubscribe();
      if (user) {
        console.log(user);
        /*
        firebase.database().ref("/users/").set({

        });
        */
        redirect_to_url();
      } else {
        load_login();
      }
  });
})();