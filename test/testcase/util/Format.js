describe("util.Format", function() {
	
	beforeEach(function() {  
	  	
		Format = module("util.Format");
	});
	
	
	it("Format.format",function(){
		
		var fm="{1},{2}";
		
		expect(Format.format(fm,1)).toEqual("1,");
		expect(Format.format(fm,1,2)).toEqual("1,2");
		expect(Format.format(fm,"1","2")).toEqual("1,2");
		expect(Format.format(fm,"a","b")).toEqual("a,b");
		expect(Format.format(fm,"a","b","c")).toEqual("a,b");
	});
	
	it("Format.camelize",function(){
		
		var before= "font-size";
	 	var after= Format.camelize(before); //"fontSize"

		expect(after).toEqual("fontSize");		
	});	
	
});		