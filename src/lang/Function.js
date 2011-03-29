/**
 * @name lang.Function
 * @class
 */
module("lang.Function", function(global){
	//IMPORT
    var Base = module("lang.Base");

    /**
     * ECMA-262-5 15.3.4.5
     * Sets the value of func inside the function to always be
     * the value of thisArg when the function is called. Optionally,
     * function arguments can be specified (arg1, arg2, etc) that will
     * automatically be prepended to the argument list whenever func
     * function is called.
     *
     * @param  {Function} thisArg
     * @param  {Object} arg1 {optinal}
     * @param  {Object} arg2 {optinal}
     * @example var flatFunction = obj.method.bind(obj);
     */
    var bind = function(func, thisArg/*[arg1],[arg2],...*/){
		
		if(func.bind){
			return func.bind();
		}
		
        if (!Base.isFunction(func)) 
            Base.error("Bind must be called on a function");
		
        
        // thisArg is not an argument that should be bound.
        var argc_bound = (arguments.length || 1) - 1;
        if (argc_bound > 0) {
            var bound_args = new Array(argc_bound);
            for (var i = 0; i < argc_bound; i++) {
                bound_args[i] = arguments[i + 1];
            }
        }
		
        var fn = func;
		
        var result = function(){
            // Combine the args we got from the bind call with the args
            // given as argument to the invocation. 
            var argc = arguments.length;
            var args = new Array(argc + argc_bound);
            // Add bound arguments.
            for (var i = 0; i < argc_bound; i++) {
                args[i] = bound_args[i];
            }
            // Add arguments from call.
            for (var i = 0; i < argc; i++) {
                args[argc_bound + i] = arguments[i];
            }
			
            return fn.apply(thisArg, args);
        };
        
        return result;
    };
    
	
    /**
     * 延迟执行
     * @param {Integer} delay 延迟
     * @param {Array} args {optinal} 函数参数
     * @return {Integer}  timeoutID
     * @example 
     */
    var defer = function(func, delay, args){
		if(func.defer){
			return func.defer(delay, args);
		}
		
        if (!Base.isFunction(func)) 
            Base.error("Defer must be called on a function");
        delay = delay || 0;
        return setTimeout(func, delay, args);
    };
	
    /**
     * Defer until a passed func returns true.
     * @param {Function} condition 条件函数
     * @param {Number} time  超时时间
     * @param {Array} args  {optinal} 
     * @param {Function} callback  {optinal} 超时回调函数
     * @return {Integer} intervalID
     * @example 
     */
   	var deferUntil = function(func, condition, time, args, callback){
		if(func.deferUntil){
			return func.deferUntil(condition, time, args, callback);
		}
		
        if (typeof condition != 'function' || time && typeof time != 'number') 
            Base.error("");
        
        if (condition()) { //条件函数返回true
            condition();   //执行当前函数
            return;
        }
		
        var that = func, intervalID = null, start = (new Date()).getTime();
		
        var intervalFn = function(){
            if (!condition()) { //条件函数返回false
				if (time && (new Date().getTime() - start) >= time) {
					callback && callback(); //执行超时回调函数
				}else {
					return;
				}
			}else { //条件函数返回true
				
				intervalID && clearInterval(intervalID);//取消Interval
				
				that(); //执行当前函数
			}
        };
		
        intervalID = setInterval(intervalFn, 20, args);
		
        return intervalID;
    };
    
	/**
	 * 间隔执行
     * @param {Integer} delay 延迟
     * @param {Array} args {optinal} 函数参数
	 * @return {Integer} intervalID
	 * @example 
	 */
    var recur = function(func , delay, args){
		if(func.recur){
			return func.recur(delay, args);
		}
		
        if (!Base.isFunction(func)) 
            Base.error("Recur must be called on a function");
			
        return setInterval(func, delay, args);
    };
	
	//EXPOSE
	return {
		"bind" : bind,
		"recur" : recur,
		"defer" :defer,
		"deferUntil" :deferUntil
		
	};
    
    
});
