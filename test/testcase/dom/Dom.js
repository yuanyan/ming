describe("dom.Dom", function() {

	beforeEach(function() {  
	  Dom = module("dom.Dom");
	});

	it("Dom",function(){

		expect(Dom).toBeTruthy();
		
	});
	
	it("Dom.isNode",function(){

		var  Node = module("dom.Node");
		expect(Dom.isNode(new Node)).toBeTruthy();
		
	});	
	
	it("Dom.create",function(){

		expect(Dom.create("div").on).toBeTruthy();
		
	});

	it("Dom.remove",function(){ //未加载 dom.Selector
		expect(function(){
			Dom.remove("div")
		}).toThrow();
		
	});	
 

});