class C {
    example() {
        function d() {
            console.log(this);
        }
    }
}

var c = new C();
c.example();