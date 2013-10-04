var expect = require('../lib/expect');
require('../../lib/jquery/jquery');
require('../../dist/ming');

describe("runtime module", function() {


    var Person = $.Object.extend({
        initialize: function(n){
            this.name=n
        },
        name:'init'
    });

    var person = new Person('pony');



    it("support methods", function(){

        expect(person.watch).to.be.ok();
        expect(person.unwatch).to.be.ok();
        expect(person.clone).to.be.ok();
        expect(person.on).to.be.ok();
        expect(person.off).to.be.ok();
        expect(person.once).to.be.ok();
        expect(person.many).to.be.ok();
        expect(person.onAny).to.be.ok();
        expect(person.offAny).to.be.ok();
        expect(person.emit).to.be.ok();
    });


    it("watch object prop", function(done){

        person.watch('name', function(p, o, n){
            expect(p).to.be('name')
            expect(o).to.be('pony')
            expect(n).to.be('tony')
            done();
        })

        expect(person.name).to.be('pony');

        person.name = "tony";
        expect(person.name).to.be('tony')
    })


    it('unwatch object prop', function(){
        var isFire = false
        person.age = 18
        person.watch('age', function(p, o, n){
            isFire = true
        })
        person.unwatch()
        person.age = 81
        expect(isFire).to.be(false)
        expect(person.age).to.be(81)

    })

    it('obs single event', function(done){
         person.on('sleep', function(v){
             expect(v).to.be(12)
             done();
         })
         person.emit('sleep',12)

    })

    it('obs many event', function(done){

        person.many('walking', 3, function(){
           done()
        });

        person.emit('walking', 9)
        person.emit('walking', 19)
        person.emit('walking', 29)
    })


    it('object clone', function(){
         var des = {'my':'sweet'};
         person.des = des;
         var winny = person.clone(true);
         expect(winny.des.my).to.be('sweet')
         expect(winny.des).not.to.be(des)
    })


});
