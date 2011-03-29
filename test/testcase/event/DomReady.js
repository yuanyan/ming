describe("event.DomReady", function(){

	beforeEach(function(){
		DomReady = module("event.DomReady");
	});
	
	it("DomReady", function(){
		
		expect(DomReady).toBeTruthy();
		
	});

	it("onReady", function(){
		
		expect(DomReady.onReady).toBeTruthy();
		
		DomReady.onReady(function(){
			console.log("onReady!")
		});
		
	});	
	
	/*
	  
	spyOn(Klass, 'asyncMethod');
	var callback = jasmine.createSpy();
	
	Klass.asyncMethod(callback);
	expect(callback).not.toHaveBeenCalled();
	
	var someResponseData = 'foo';
	Klass.asyncMethod.mostRecentCall.args[0](someResponseData);
	expect(callback).toHaveBeenCalledWith(someResponseData);

	 */
	
	/*
	it("DomReady.onReady", function(){
		
		//function Klass(){}
		//Klass.handler = function(){console.log("onReady!")};

		spyOn(DomReady,"onReady");
	  	var callback = jasmine.createSpy();
			
		DomReady.onReady(callback);
		
		DomReady.onReady(function(){
			console.log("onReady!")
		});
		expect(callback).toHaveBeenCalled();
		
	});

	*/

	
});