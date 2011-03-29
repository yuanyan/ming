describe("storage.LocalStorage", function(){

	beforeEach(function(){

		storage = module("storage.LocalStorage");
		
		storage.set("name","yuanyan");

				
	});
	
	it("LocalStorage.length", function(){
		
		expect(storage.length()).toBeTruthy();
		
	});

	it("LocalStorage.key", function(){
		
		expect(storage.key(0)).toBeTruthy();
		
	});	

	it("LocalStorage.set", function(){
		
		var name  = "id", value = 1;
		storage.set(name,value);

	});	
	
	it("LocalStorage.remove", function(){

		expect(storage.remove("id")).toBeFalsy();
		
	});		


	it("LocalStorage.get", function(){
		
		expect(storage.get("name")).toEqual("yuanyan");

	});	
		
	

	
});