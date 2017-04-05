var database = firebase.database();
var currentUser = database.ref("/users/" + user.uid);

function update_user(user) {
  console.log(user);
  currentUser.set({
    "uid": user.uid,
    "name": user.displayName,
    "last_login": Date()
  });
}