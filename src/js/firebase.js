'use strict';
var config = {
  apiKey: "AIzaSyD-b_XD6-Eoe-hQnSsIyHt_s2P2bexLu_E",
  authDomain: "jrtapsell-ctf.firebaseapp.com",
  databaseURL: "https://jrtapsell-ctf.firebaseio.com",
  projectId: "jrtapsell-ctf",
  storageBucket: "jrtapsell-ctf.appspot.com",
  messagingSenderId: "706159874560"
};

firebase.initializeApp(config);


var database = firebase.database();
var auth = firebase.auth();

var fb = {
  "db": database,
  "auth": auth,
  "now": firebase.database.ServerValue.TIMESTAMP,
  "path": function () {
    var ret = database.ref("/");
    for (var i = 0; i < arguments.length; i++) {
      ret = ret.child(arguments[i])
    }
    return ret;
  },
  "authUpdate": auth.onAuthStateChanged,
  "google": new firebase.auth.GoogleAuthProvider(),
  "github": new firebase.auth.GithubAuthProvider(),
  "popupLogin": auth.signInWithPopup,
  "logout": auth.signOut(),
  "user": 0
};

fb.authUpdate(function (user) {
  fb.user = user;
});

$(function() {
  fb.authUpdate(function (user) {
    if (user) {
      $("#login-status").html("Hello, " + user.displayName + ", <a href='/logout/'>Logout</a>");
      $(".mdl-layout__drawer-button").show();
      console.log(user);
      fb.path("users", user.uid).set({
        image: user.photoURL,
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        provider: user.providerData[0].providerId
      });
    } else {
      $("#login-status").text("I don't know you");
      $(".mdl-layout__drawer-button").hide();
    }
  });
});