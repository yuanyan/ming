/**
 * @name lang.String
 * @class
 */
module("lang.String", function(){
    var LEFT = /^\s+/, RIGHT = /\s+$/;
    
    /**
     * ECMA-262-5 15.5.4.20
     * Trims whitespace from both ends of the string
     */
    var trim = function(str){
        return str.replace(LEFT, "").replace(RIGHT, "");
    };
    /**
     * Trims whitespace from the left side of the string
     */
    var trimLeft = function(str){
        return str.replace(LEFT, "");      
    };
    
    /**
     * Trims whitespace from the right side of the string
     */
    var trimRight = function(str){
        return str.replace(RIGHT, "");
    };
    
	//EXPOSE
	return {
		"trim":trim,
		"trimLeft" : trimLeft,
		"trimRight" : trimRigh	
	};
});
