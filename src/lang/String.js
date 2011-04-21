/**
 * Class: String
 */
module("lang.String", function(){
    var LEFT = /^\s+/, RIGHT = /\s+$/;
    
    /**
     * Function: trim
     * ECMA-262-5 15.5.4.20
     * Trims whitespace from both ends of the string
     * 
     * Parameters:
     *  str - {String}
	 * 
	 * Returns:
	 *	 {String}
     */
    var trim = function(str){
        return str.replace(LEFT, "").replace(RIGHT, "");
    };
    /**
     * Function: trimLeft
     * Trims whitespace from the left side of the string
     * 
     * Parameters:
     *  str - {String}
	 * 
	 * Returns:
	 *	 {String}
     */
    var trimLeft = function(str){
        return str.replace(LEFT, "");      
    };
    
    /**
     * Function: trimRight
     * Trims whitespace from the right side of the string
     * 
     * Parameters:
     *  str - {String}
	 * 
	 * Returns:
	 *	 {String}
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
