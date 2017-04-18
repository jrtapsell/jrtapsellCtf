/// <reference path="myTypes.ts" />
function all_defined() {
    var date = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        date[_i - 0] = arguments[_i];
    }
    for (var _a = 0, date_1 = date; _a < date_1.length; _a++) {
        var item = date_1[_a];
        if (item === undefined) {
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
//# sourceMappingURL=utils.js.map