var expect = require('../lib/expect');
require('../../lib/jquery/jquery');
require('../../dist/module');

describe("runtime module", function() {


    var Person = $.Object.extend({
        initialize: function(n){this.name=n},
        name:'',
        hi: function(){console.log(this)}
    });

    var person = new Person('pony');

    it("support methods", function(){

        expect(person.watch).to.be.ok();
        expect(person.unwatch).to.be.ok();
        expect(person.clone).to.be.ok();
        expect(person.on).to.be.ok();
        expect(person.off).to.be.ok();
        expect(person.emit).to.be.ok();
    });

});
