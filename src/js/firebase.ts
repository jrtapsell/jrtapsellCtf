/// <reference path="myTypes.ts" />

var fb;

((firebase) => {
  'use strict';

  function log(color, messageContents, data?) {
    console.colourLog("#F00", color, messageContents, data);
  }

  var config = {
    apiKey: "AIzaSyD-b_XD6-Eoe-hQnSsIyHt_s2P2bexLu_E",
    authDomain: "jrtapsell-ctf.firebaseapp.com",
    databaseURL: "https://jrtapsell-ctf.firebaseio.com",
    projectId: "jrtapsell-ctf",
    storageBucket: "jrtapsell-ctf.appspot.com",
    messagingSenderId: "706159874560"
  };

  class WrappedNode {
    private node;
    private text;
    constructor(node, text) {
      this.node = node;
      this.text = text;
    }

    on(type, callback) {
      log("#FF0", "Requested callback on " + this.text);
      return this.node.on(type, callback);
    }

    off(type, callback) {
      log("#0FF", "Disconnecting callback on " + this.text);
      return this.node.off(type, callback);
    }

    once(type, callback) {
      log("#F0F", "Single use callback on " + this.text);
      return this.node.once(type, callback);
    }

    push(data) {
      log("#FFF", "Pushing data on " + this.text, data);
      return this.node.push(data);
    }

    set(data) {
      log("#00F", "Setting data on " + this.text, data);
      return this.node.set(data);
    }
  }
  
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
        ret = ret.child(name);
      }
      log("#0F0", "Created node " + text);
      return new WrappedNode(ret, text);
    },
    /** Calls the callback when the auth state changes. */
    "authUpdate": (callback) => {
      return firebase.auth().onAuthStateChanged(callback);
    },
    /** Called on the next auth change. */
    "authOnce": (callback) => {
      var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        callback(user);
      });
    },
    /** Google popup login. */
    "googleLogin": () => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    /** GitHub popup login. */
    "githubLogin": () => {
      firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    },
    /** Logout the current user. */
    "logout": () => {
      log("#F00", "Logging out");
      firebase.auth().signOut();
    },
    /** The current user. */
    "user": undefined
  };

  fb.authUpdate((user) => {
    fb.user = user;
  });

  $(() => {
    fb.authUpdate((user) => {
      if (user) {
        $("#login-status").html("Hello, " + user.displayName + ", <a href='/logout/'>Logout</a>");
        $(".mdl-layout__drawer-button").show();
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