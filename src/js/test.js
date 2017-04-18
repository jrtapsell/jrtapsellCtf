var C = (function () {
    function C() {
    }
    C.prototype.example = function () {
        var _this = this;
        var f = function () {
            console.log(_this);
        };
        f();
    };
    return C;
}());
var c = new C();
c.example();
//# sourceMappingURL=test.js.map