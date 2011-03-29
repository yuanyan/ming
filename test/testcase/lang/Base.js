describe("base", function() {

	beforeEach(function() {  
	  Base = module("lang.Base");
	});
	
	
	it("Base.isString",function(){
		var str1 = new String("i am string");
		var str2 = "i am string";
		expect(Base.isString(str1)).toBeTruthy();
		expect(Base.isString(str2)).toBeTruthy();
	});
	
	it("Base.isArray",function(){
		var arr1 = new Array(1,2,3);
		var arr2 = [1,2,3];
		
		var obj1 = new Object();
		obj1.length = 1;
		
		expect(Base.isArray(arr1)).toBeTruthy();
		expect(Base.isArray(arr2)).toBeTruthy();
		expect(Base.isArray(obj1)).toBeFalsy();
	});	

	it("Base.isObject",function(){
		
		var arr1 = new Array(1,2,3);
		var str1 = new String("i am string");
		var obj1 = new Object();
		
		expect(Base.isObject(obj1)).toBeTruthy();
		expect(Base.isObject(arr1)).toBeFalsy();
		expect(Base.isObject(str1)).toBeFalsy();
	});		

	it("Base.isEmptyObject",function(){
		
		var obj1 = new Object();
		obj1.length = 1;
		
		var obj2 = new Object();
		
		expect(Base.isEmptyObject(obj1)).toBeFalsy();
		expect(Base.isEmptyObject(obj2)).toBeTruthy();
	});	
	
	it("Base.isBoolean",function(){
		var bool1 = new Boolean();
		var bool2 = false;
		
		expect(Base.isBoolean(bool1)).toBeTruthy();
		expect(Base.isBoolean(bool2)).toBeTruthy();
	});		
	
	it("Base.isEmpty",function(){
		var bool1 = new Boolean();
		var obj1 = new Object();
		var arr1 = new Array(1,2,3);
		
		expect(Base.isEmpty(bool1)).toBeFalsy();
		expect(Base.isEmpty(obj1)).toBeTruthy();
		expect(Base.isEmpty(arr1)).toBeFalsy();
		expect(Base.isEmpty(null)).toBeTruthy();
		expect(Base.isEmpty(undefined)).toBeTruthy();
		expect(Base.isEmpty([])).toBeTruthy();
		expect(Base.isEmpty("")).toBeTruthy();
		expect(Base.isEmpty("",true)).toBeFalsy();
	});

	it("Base.isDate",function(){
		var date = new Date();
		
		expect(Base.isDate(date)).toBeTruthy();
	});	


	it("Base.isNumber",function(){
		var num1 = new Number();
		var num2 = 0;
		var num3 = Number.NaN;
		var num4 = Number.NEGATIVE_INFINITY;
		
		expect(Base.isNumber(num1)).toBeTruthy();
		expect(Base.isNumber(num2)).toBeTruthy();
		expect(Base.isNumber(num3)).toBeFalsy();
		expect(Base.isNumber(num4)).toBeFalsy();	
	});	
	

	it("Base.namespace",function(){
		
		Base.namespace("test.namespace",Base);	
		expect(Base.test.namespace).toBeTruthy();

	});
	

	
	it("Base.isIterable",function(){
		
		expect(Base.isIterable([])).toBeTruthy();
		//expect(Base.isIterable(new NodeList)).toBeTruthy();

	});		

	it("Base.toArray",function(){
		expect(Base.toArray(arguments)).toEqual([]);		
		expect(Base.toArray(1)).toEqual([1]);
		expect(Base.toArray(true)).toEqual([true]);
		expect(Base.toArray("true")).toEqual(["true"]);
		expect(Base.toArray(null)).toEqual([]);
	});		

	it("Base.each",function(){


	});	
			
  /*
  it("should be empty",function(){
  	expert(window.JSON.stringify(array)).toEqual("[]");
  });
  
  it("should be trim",function(){
  	var str ="   abc   ";
  	expert(str.trim()).toEqual("abc");
  });
  
  it("should be trim",function(){
   expect(player.isPlaying).toBeFalsy();
   expect(player.isPlaying).toBeTruthy();
   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
   expect(function() {
        player.resume();
   }).toThrow("song is already playing");
  });     
 */

});