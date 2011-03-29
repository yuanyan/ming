describe("Template", function() {
	
	beforeEach(function() {  
	  	
		Template = module("template.Template");
	});
	

	
	it("Template.template",function(){
		
		var fm="${i},${j}";

		expect(Template.template(fm,{i:11})).toEqual("11,");		
		expect(Template.template(fm,{i:11,j:22})).toEqual("11,22");
		
		expect(Template.template(fm,{i:11,j:22,k:33})).toEqual("11,22");
	});	
	

	
});		