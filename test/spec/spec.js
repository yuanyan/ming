describe("setUp/tearDown", function() {
    beforeEach(function() {
        // console.log("Before");
    });

    afterEach(function() {
        // console.log("After");
    });

    it("example", function() {
        // console.log("During");
    });

    describe("setUp/tearDown", function() {
        beforeEach(function() {
            // console.log("Before2");
        });

        afterEach(function() {
            // console.log("After2");
        });

        it("example", function() {
            // console.log("During Nested");
        });
    });
});
