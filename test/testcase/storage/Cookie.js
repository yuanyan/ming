describe("storage.Cookie", function(){

	beforeEach(function(){

		Cookie = module("storage.Cookie");
		Cookie.set("name","yuanyan");

				
	});
	
	it("Cookie.length", function(){
		
		expect(Cookie.length()).toBeTruthy();
		
	});

	it("Cookie.key", function(){
		
		expect(Cookie.key(0)).toBeTruthy();
		
	});	

	it("Cookie.set", function(){
		
		var name  = "id", value = 1;
		Cookie.set(name,value);

	});	
	
	it("Cookie.remove", function(){

		expect(Cookie.remove("id")).toBeFalsy();
		
	});		


	it("Cookie.get", function(){
		
				
		expect(Cookie.get("id")).toEqual("1");

		expect(Cookie.get("name")).toEqual("yuanyan");

	});	
		
	

	
});