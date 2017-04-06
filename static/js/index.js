(function() {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    unsubscribe();
      if (user) {
        redirect_to_url();
      } else {
        $(".mdl-layout__drawer-button").hide();
        load_login();
      }
  });
})();