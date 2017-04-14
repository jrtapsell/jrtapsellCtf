function all_defined() {
  for (var index = 0; index < arguments.length; index++) {
    if (arguments[index] == undefined) {
      return false;
    }
  }
  return true;
}