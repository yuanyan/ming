describe("$.Class", function() {

    it("create a Class", function(){
        var City = $.Class({
            name: '',
            color: '',
            country: 'china'
        });

        var beijing = new City();
        beijing.country.should.equal('china')
    });

});
