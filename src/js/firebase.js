'use strict';
var fb;

(function (firebase) {

  function log(color, messageContents) {
    console.colourLog("#C33", color, messageContents);
  }

  var config = {
    apiKey: "AIzaSyD-b_XD6-Eoe-hQnSsIyHt_s2P2bexLu_E",
    authDomain: "jrtapsell-ctf.firebaseapp.com",
    databaseURL: "https://jrtapsell-ctf.firebaseio.com",
    projectId: "jrtapsell-ctf",
    storageBucket: "jrtapsell-ctf.appspot.com",
    messagingSenderId: "706159874560"
  };

  log("#F00", "Initialising firebase");
  firebase.initializeApp(config);
  log("#F00", "Initialised firebase");
  fb = {
    /* The current time. */
    "now": firebase.database.ServerValue.TIMESTAMP,
    /* Gets a node with a path made of the arguments to this method. */
    "path": function () {
      var ret = firebase.database().ref("/");
      var text = "/";
      for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i];
        text += name;
        text += "/";
        ret = ret.child(name)
      }
      log("#0F0", "Created node " + text);
      return {
        "on": function (type, callback) {
          log("#FF0", "Requested callback on " + text);
          return ret.on(type, callback);
        },
        "off": function (type, callback) {
          log("#0FF", "Disconnecting callback on " + text);
          return ret.off(type, callback);
        },
        "once": function (type, callback) {
          log("#F0F", "Single use callback on " + text);
          return ret.once(type, callback);
        },
        "push": function (data) {
          log("#FFF", "Pushing data on " + text);
          console.log("Data", data);
          log("#F00", "DATA END");
          return ret.push(data);
        },
        "set": function (data) {
          log("#00F", "Setting data on " + text);
          console.log("Data", data);
          log("#0F", "DATA END");
          return ret.set(data);
        }
      };
    },
    /** Calls the callback when the auth state changes. */
    "authUpdate": function (callback) {
      return firebase.auth().onAuthStateChanged(callback);
    },
    /** Google popup login. */
    "googleLogin": function() {firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())},
    /** GitHub popup login. */
    "githubLogin": function() {firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())},
    /** Logout the current user. */
    "logout": function() {
      log("#F00", "Logging out");
      firebase.auth().signOut()
    },
    /** The current user. */
    "user": undefined
  };

  fb.authUpdate(function (user) {
    fb.user = user;
  });

  $(function () {
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
})(firebase);