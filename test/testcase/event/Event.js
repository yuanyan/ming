describe("event.Event", function(){

	beforeEach(function(){
		Event = module("event.Event");
	});
	
	it("Event", function(){
		
		expect(Event).toBeTruthy();
		
	});
	
	it("Event.on", function(){
		
		expect(Event.on).toBeTruthy();
		
	});

	it("Event.off", function(){
		
		expect(Event.off).toBeTruthy();
		
	});	

	it("Event.fire", function(){
		
		expect(Event.fire).toBeTruthy();
		
	});	


	it("Event.live", function(){
		
		expect(Event.live).toBeTruthy();
		
	});	
	
});