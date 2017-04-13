$(".mdl-layout__drawer-button").hide();
var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    unsubscribe();
    $(".mdl-layout__drawer-button").show();
    load_index();
  }
});

$("#google-login").click(function () {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
});

$("#github-login").click(function () {
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
});