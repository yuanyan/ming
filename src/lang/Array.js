/**
 * Class: Array
 */
module("lang.Array",function(){
	
    //IMPORT
	var Base = module("lang.Base");
	
    /*Array extentions start */

    /**
     * Function: remove
	 * remove the element from the first argument to the second argument,
	 * if the second argument not gived ,it will remove the element 
	 * which the fisrt argument index.
	 * 
	 * Parameters:
	 *  array - {Array}
	 * 	from - {Object}
	 * 	to - {optional}{Object} 
	 */ 
	// Array Remove - By John Resig (MIT Licensed)
	// http://ejohn.org/blog/javascript-array-remove/
    var remove = function(array, from, to){
		
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);

    };


    /**
     * Function: indexOf
     * ECMA-262-5 15.4.4.14
     * Returns the first (least) index of an element within the array
     * equal to the specified value, or -1 if none is found.
     *
     * Parameters:
     *  array - {Array}
     * 	searchElement - {Mixed} 
     * 	fromIndex {optional} - {number}
     * 
     * Returns: 
     * 	{number}
     * 
     * Example:
     * (code)
     *  indexOf(['a','b','c'], 'b') === 1
     * (end)
     */
    var indexOf = function(array, searchElement, fromIndex){
		
		if(array.indexOf){
			return array.indexOf(searchElement, fromIndex);
		}
		
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.   		
        var len = array.length;

        if (len === 0){
            return - 1;
        }

        if (fromIndex === undefined){
            fromIndex = 0;
        } else{
            // If fromIndex is negative, fromIndex from the end of the array.
            if (fromIndex < 0)
            fromIndex = len + fromIndex;
            // If fromIndex is still negative, search the entire array.
            if (fromIndex < 0)
            fromIndex = 0;
        }
        if (searchElement !== undefined){
            for (var i = fromIndex; i < len; i++){
                if (array[i] === searchElement)
                return i;
            }
            return - 1;
        }
        // Lookup through the array.
        for (var j = fromIndex; j < len; j++){
            if (array[j] === undefined && j in array){
                return j;
            }
        }
        return - 1;
    };



    /**
     * Function: lastIndexOf
     * ECMA-262-5 15.4.4.15
     * Returns the last (greatest) index of an element within the array
     * equal to the specified value, or -1 if none is found.
     *
     * Parameters:
     *  array - {Array}
     * 	searchElement - {Mixed} 
     * 	fromIndex - {optional} {number}
     * 
     * Returns:
     *  {number}
     * 
     * Example:
     * (code)
     *  lastIndexOf(['a','a','c'], 'a') === 1
     * (end) 
     */
     var lastIndexOf = function(array, searchElement, fromIndex){
		if(array.lastIndexOf){
			return array.lastIndexOf(searchElement, fromIndex);
		}	 	
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.      
        var len = array.length;

        if (len == 0){
            return - 1;
        }

        if (arguments.length < 2){
            fromIndex = len - 1;
        }
        else{
            // If index is negative, index from end of the array.
            if (fromIndex < 0)
            fromIndex = len + fromIndex;
            // If fromIndex is still negative, do not search the array.
            if (fromIndex < 0)
            fromIndex = -1;
            else
            if (fromIndex >= len)
            fromIndex = len - 1;
        }
        // Lookup through the array.
        if (searchElement !== undefined){
            for (var i = fromIndex; i >= 0; i--){
                if (array[i] === searchElement)
                return i;
            }
            return - 1;
        }
        for (var i = fromIndex; i >= 0; i--){
            if (array[i] === undefined && i in array){
                return i;
            }
        }
        return - 1;


    };


    /**
     * Function: every
     * ECMA-262-5 15.4.4.16
     * Returns true if every element in array array
     * satisfies the provided testing function.
     * 
     * Parameters:
     *  array - {Array}
     * 	callbackfn - {Function}
     * 	thisArg - {optional} {Object}
     */
     var every = function(array, callbackfn, thisArg){
	 	
		if(array.every){
			return array.every(callbackfn, thisArg);
		}
			 	
        if (!Base.isFunction(callbackfn))
        	Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.       
        var len = array.length;

        for (var i = 0; i < len; ++i){
            var current = array[i];
            if (current !== undefined || i in array){
                if (!callbackfn.call(thisArg, current, i, array))
                return false;
            }
        }

        return true;
    };


    /**
     * Function: some
     * ECMA-262-5 15.4.4.17
     * Returns true if at least one element in array array
     * satisfies the provided testing function.
     * 
     * Parameters:
     *  array - {Array}
     * 	callbackfn - {Function} 
     * 	thisArg - {Object} {optional}
     */
     var some = function(array, callbackfn, thisArg){
		if(array.some){
			return array.some(callbackfn, thisArg);
		}
			 	
        if (!Base.isFunction(callbackfn))
        Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.          
        var len = array.length;
        for (var i = 0; i < len; ++i){
            var current = array[i];
            if (current !== undefined || i in array){
                if (callbackfn.call(thisArg, current, i, array))
                return true;
            }
        }

        return false;
    };


    /**
     * Function: forEach
     * ECMA-262-5 15.4.4.18
     * Calls a function for each element in the array.
     * 
     * Parameters:
     * 	array - {Array}
     *	callbackfn - {Function}
     * 	thisArg - {optional} {Object} 
     */ 
    var forEach = function(array, callbackfn, thisArg){
		if(array.forEach){
			return array.forEach(callbackfn, thisArg);
		}
				
        if (!Base.isFunction(callbackfn))
        	Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.        
        var len = array.length;
        for (var i = 0; i < len; ++i){
            var current = array[i];
            if (current !== undefined || i in array){
                callbackfn.call(thisArg, current, i, array);
            }
        }
    };

    /**
     * Function: map
     * ECMA-262-5 15.4.4.19
     * Creates a new array with the results of calling
     * a provided function on every element in array array.
     * 
     * Parameters:
     *  array - {Array}
     *  callbackfn - {Function}
     *  thisArg - {Object}
     *  
     * Returns:
     *  {Array}
     */

     var map = function(array, callbackfn, thisArg){
		if(array.map){
			return array.map(callbackfn, thisArg);
		}
			 	
        if (!Base.isFunction(callbackfn))
        	Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.          
        var len = array.length,
        result = new Array(len);
        for (var i = 0; i < len; ++i){
            var current = array[i];
            if (current !== undefined || i in array){
                result[i] = callbackfn.call(thisArg, current, i, array);
            }
        }
        return result;
    };


    /**
     * Function: filter
     * ECMA-262-5 15.4.4.20
     * Creates a new array with all of the elements of array array
     * for which the provided filtering function returns true.
     * 
     * Parameters:
     *  array - {Array}
     *  callbackfn - {Function}
     *  thisArg - {Object}
     * 
     * Returns:
     *  {Array}
     */

    var filter = function(array, callbackfn, thisArg){
	
		if(array.filter){
			return array.filter(callbackfn, thisArg);
		}
				
        if (!Base.isFunction(callbackfn))
        	Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.       
        var len = array.length,
        result = [];
        for (var i = 0; i < len; ++i){
            var current = array[i];
            if (current !== undefined || i in array){
                callbackfn.call(thisArg, current, i, array) && result.push(array[i]);
            }
        }

        return result;
    };


    /**
     * Function: reduce
     * ECMA-262-5 15.4.4.21
     * Apply a function simultaneously against two values of
     * the array (from left-to-right) as to reduce it to a single value.
     * 
     * Parameters:
     *  array - {Array}
     *  callbackfn - {Function}
     *  current - {optional} initialValue 
     *  
     */
    var reduce = function(array, callbackfn, current){
		
		if(array.reduce){
			return array.reduce(callbackfn, current);
		}
		
        if (!Base.isFunction(callbackfn))
       		Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.       
        var len = array.length,
			i = 0;

        find_initial:
        if (arguments.length < 2){
            for (; i < len; i++){
                current = array[i];
                if (current !== undefined || i in array){
                    i++;
                    break find_initial;
                }
            }
            Base.error("reduce of empty array with no initial value");
        }

        for (; i < len; i++){
            var element = array[i];
            if (element !== undefined || i in array){
                current = callbackfn.call(array, current, element, i, array);
            }
        }
        return current;
    };


    /**
     * Function: reduceRight
     * ECMA-262-5 15.4.4.22
     * Apply a function simultaneously against two values of
     * the array (from right-to-left) as to reduce it to a single value.
     * 
     * Parameters:
     *  array - {Array}
     * 	callbackfn - {Function}
     *  current - {optional} initialValue
     */
   
    var reduceRight = function(array, callbackfn, initialValue){
		
		if(array.reduceRight){			
			return array.reduceRight(callbackfn, current)
		}
		
        if (!Base.isFunction(callbackfn))
        	Base.error(callbackfn + " is not a function");
        // Pull out the length so that modifications to the length in the
        // loop will not affect the looping.        
        var i = array.length - 1,
			current;

        find_initial:
        if (arguments.length < 2){
            for (; i >= 0; i--){
                current = array[i];
                if (current !== undefined || i in array){
                    i--;
                    break find_initial;
                }
            }
            Base.error("reduce of empty array with no initial value");
        }

        for (; i >= 0; i--){
            var element = array[i];
            if (element !== undefined || i in array){
                current = callbackfn.call(null, current, element, i, array);
            }
        }
        return current;
    };

    /*Array  extentions end */
	
	//EXPOSE
	return {
		"remove" : remove,
		"indexOf" : indexOf,
		"lastIndexOf" : lastIndexOf,
		"every" : every,
		"some" : some,
		"filter" : filter,
		"reduce" : reduce,
		"reduceRight" :reduceRight
	};
	
});