var expect = require('../lib/expect');
require('../../lib/jquery/jquery');
require('../../dist/module');

describe("eventemitter module", function() {
	var EventEmitter = $.EventEmitter;
    it("binds by wildcard", function(done){
	
		var emitter = new EventEmitter({ 
		  wildcard: true,
		  verbose: true
		});

		emitter.on('test10.*.foo', function () {
			done();
		});
		
		emitter.emit('test10.ns1.foo');
    });
	
    it("emit by wildcard", function(done){
	
		 var emitter = new EventEmitter({ 
		  wildcard: true,
		  verbose: true
		});

		emitter.on('test11.ns1.foo', function () {
		   done();
		});
		
		emitter.emit('test11.*.foo');
    });


    it("Emitting with a wildcard targeted at once", function(done){
	
		var emitter = new EventEmitter({ 
		  wildcard: true,
		  verbose: true
		});

		var type = 'test1.foo.bar';
		var type2 = 'test1.foo.*';
		var functionA = function() { done(); };

		emitter.once(type, functionA);
		emitter.emit(type2);
		emitter.emit(type2);
    });


    it("Emitting with a multi-level wildcard targeted at once", function(done){
	
		var emitter = new EventEmitter({ 
		  wildcard: true,
		  verbose: true
		});

		var type = 'test1.foo.bar';
		var type2 = 'test1.**';
		var functionA = function() { done() };

		emitter.once(type, functionA);
		emitter.emit(type2);
		emitter.emit(type2);
    });


    it("multi-level wildcard event binds", function(){
	
		var emitter = new EventEmitter({ 
		  wildcard: true,
		  verbose: true
		});

		var firedCounter = 0;
		var i = 0;
		var f = function (n) {
		  return function() {
			//console.log('Event', n, 'fired by', this.event);
			++firedCounter;
		  };
		};

		emitter.on('**.test', f(i++));     // 0: 0 + 1 + 0 + 0 + 1 + 1 + 1 + 1 + 1 + 1
		emitter.on('**.bar.**', f(i++));   // 1: 0 + 1 + 1 + 1 + 1 + 0 + 0 + 1 + 1 + 1
		emitter.on('**.*', f(i++));        // 2: 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
		emitter.on('*.**', f(i++));        // 3: 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
		emitter.on('**', f(i++));          // 4: 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
		emitter.on('other.**', f(i++));    // 5: 1 + 0 + 0 + 0 + 1 + 0 + 0 + 0 + 1 + 1
		emitter.on('foo.**.test', f(i++)); // 6: 0 + 1 + 0 + 0 + 1 + 0 + 1 + 1 + 1 + 1
		emitter.on('test.**', f(i++));     // 7: 0 + 0 + 0 + 0 + 1 + 1 + 0 + 0 + 1 + 1
		// Add forbidden patterns for safety purpose.
		emitter.on('**.**', f(i++));
		emitter.on('a.b.**.**', f(i++));
		emitter.on('**.**.a.b', f(i++));
		emitter.on('a.b.**.**.a.b', f(i++));

		emitter.emit('other.emit');   // 4  
		emitter.emit('foo.bar.test'); // 6
		emitter.emit('foo.bar.test.bar.foo.test.foo'); // 4
		emitter.emit('bar.bar.bar.bar.bar.bar'); // 4
		emitter.emit('**.*'); // 8
		emitter.emit('test'); // 5
		emitter.emit('foo.test'); // 5
		emitter.emit('foo.**.*'); // 6
		emitter.emit('**.test'); // 8
		emitter.emit('**.test.**'); // 8
		
		
		expect(firedCounter).to.be(58)
	});

	it("Listeners on *, *::*, foo.test with emissions from *, *::* and foo.test'", function(){
	
		var emitter = new EventEmitter({ 
		  wildcard: true,
		  delimiter: '::'
		});
		
		var firedCounter = 0;

		var f = function () {
		  ++firedCounter
		};

		emitter.on('foo::test', f);
		emitter.on('*::*', f);
		emitter.on('*', f);

		emitter.emit('*::*');    
		emitter.emit('foo::test');
		emitter.emit('*')
		
		expect(firedCounter).to.be(5)
			
	});	

});
