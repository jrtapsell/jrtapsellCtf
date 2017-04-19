/// <reference path="myTypes.ts" />

function all_defined(...date: Object[]): boolean {
  for (var item of date) {
    if (item === undefined) {
      return false;
    }
  }
  return true;
}

console.colourLog = function (background, colour, text, data): void {
  'use strict';
  console.groupCollapsed("%c %c " + text, "background:" + background, "color:" + colour);
  console.log("DATA", data);
  console.trace();
  console.groupEnd();
};