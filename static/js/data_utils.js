function update_user(user) {
  var database = firebase.database();
  var currentUser = database.ref("/users/" + user.uid);
  console.log(user);
  currentUser.set({
    "uid": user.uid,
    "name": user.displayName,
    "last_login": Date(),
    "image": user.photoURL
  });
}