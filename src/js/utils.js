function all_defined() {
  for (var index = 0; index < arguments.length; index++) {
    if (arguments[index] === undefined) {
      return false;
    }
  }
  return true;
}

var database = firebase.database();
var auth = firebase.auth();

fb = {
  "db": database,
  "auth": auth,
  "now": firebase.database.ServerValue.TIMESTAMP,
  "ref": database.ref,
  "path": function () {
    var ret = database.ref("/");
    for (var i = 0; i < arguments.length; i++) {
      ret = ret.child(arguments[i])
    }
    return ret;
  }
};