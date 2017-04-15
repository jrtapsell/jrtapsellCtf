'use strict';
function all_defined() {
  for (var index = 0; index < arguments.length; index++) {
    if (arguments[index] === undefined) {
      return false;
    }
  }
  return true;
}

console.colourLog = function (background, colour text, data) {
  console.groupCollapsed("%c" + text, "color:" + colour + ";background:" + background);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};