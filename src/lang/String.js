/**
 * @name lang.String
 * @class
 */
module("lang.String", function(){
    var trimLeft = /^\s+/, trimRight = /\s+$/;
    
    /**
     * ECMA-262-5 15.5.4.20
     * Trims whitespace from both ends of the string
     */
    var trim = function(str){
        return str.replace(trimLeft, "").replace(trimRight, "");
    };
    /**
     * Trims whitespace from the left side of the string
     */
    var trimLeft = function(str){
        return str.replace(trimLeft, "");      
    };
    
    /**
     * Trims whitespace from the right side of the string
     */
    var trimRight = function(str){
        return str.replace(trimRight, "")
    };
    
	//EXPOSE
	return {
		"trim":trim,
		"trimLeft" : trimLeft,
		"trimRight" : trimRigh	
	}
});
