/// <reference path="myTypes.ts" />
function all_defined() {
    'use strict';
    var date = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        date[_i - 0] = arguments[_i];
    }
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
//# sourceMappingURL=utils.js.map