'use strict';
function all_defined() {
  for (var index = 0; index < arguments.length; index++) {
    if (arguments[index] === undefined) {
      return false;
    }
  }
  return true;
}

console.colourLog = function (colour, background, text) {
  console.trace("%c" + text, "color:" + colour + ";background:" + background);
};