function all_defined() {
  'use strict';
  for (var index = 0; index < arguments.length; index++) {
    if (arguments[index] === undefined) {
      return false;
    }
  }
  return true;
}

console.colourLog = function (background, colour, text, data) {
  'use strict';
  console.groupCollapsed("%c %c " + text, "background:" + background, "color:" + colour);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};