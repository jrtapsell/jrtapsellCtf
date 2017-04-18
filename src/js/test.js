var C = (function () {
    function C() {
    }
    C.prototype.example = function () {
        function d() {
            console.log(this);
        }
    };
    return C;
}());
var c = new C();
c.example();
//# sourceMappingURL=test.js.map