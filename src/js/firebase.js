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

//firebase.database().ref("/users").child("GHHAcG4nLFVeO30J1GwYhRPqaek2").child("image").once("value",function(data){console.log(data.val())})

$(function() {
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
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $("#login-status").text("Hello, " + user.displayName);
    } else {
      $("#login-status").text("I don't know you");
    }
  });
});