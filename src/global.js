/**
 * ECMA-262-5 15.5.4.20
 * Trims whitespace from both ends of the string
 */
String.prototype.trim ||
(String.prototype.trim = function(){
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
});

/**
 * ECMA-262-5 15.4.4.18
 * Calls a function for each element in the array.
 * @param {Object} callbackfn
 * @param {Object} thisArg   {optional}
 */
Array.prototype.forEach ||
(Array.prototype.forEach = function(callbackfn, thisArg){
    if (!typeof callbackfn === "function") 
        throw Error(callbackfn + " is not a function");
    // Pull out the length so that modifications to the length in the
    // loop will not affect the looping.        
    var len = this.length;
    for (var i = 0; i < len; ++i) {
        var current = this[i];
        if (current !== undefined || i in this) {
            callbackfn.call(thisArg, current, i, this);
        }
    }
});

/**
 * ECMA-262-5 15.3.4.5
 * Sets the value of this inside the function to always be
 * the value of thisArg when the function is called. Optionally,
 * function arguments can be specified (arg1, arg2, etc) that will
 * automatically be prepended to the argument list whenever this
 * function is called.
 *
 * @param  {Function} thisArg
 * @param  {Object} arg1 {optinal}
 * @param  {Object} arg2 {optinal}
 * @example var flatFunction = obj.method.bind(obj);
 */
Function.prototype.bind ||
(Function.prototype.bind = function(thisArg/*[arg1],[arg2],...*/){
    if (!typeof this === "function") 
        throw new Error("Bind must be called on a function");
    
    // thisArg is not an argument that should be bound.
    var argc_bound = (arguments.length || 1) - 1;
    if (argc_bound > 0) {
        var bound_args = new Array(argc_bound);
        for (var i = 0; i < argc_bound; i++) {
            bound_args[i] = arguments[i + 1];
        }
    }
    
    var fn = this;
    
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
});


/**
 * 模块声明，模块名称大小写敏感
 * @param {String} ns 命名空间
 * @param {Function} fn 模块
 * @param {String|Array} deps 依赖模块 "fx.Base fx.Color" ["fx.Base","fx.Color"]
 * @param {Object} global 全局命名空间
 * @return {Object} module
 * @example  module("lang.JSON",function(global){});
 */
var module = (function(global, undefined){
	
	global.moduleConfig = global.moduleConfig||{"debug":true};//默认配置项

    var modules = new Object;//模块仓库
    
    var checkModule = function(ns){
        return modules.hasOwnProperty(ns);
    }
    
    var registModule = function(ns, fn, global){
        if (!checkModule(ns)) {
            modules[ns] = fn(global);
            
            //log				
            //console.log(ns + " module registed!");
        }
        else {
            throw new Error("namesapce hava been registed: "+ns);
        }
        
    };
	
	var callModule = function(ns){
		if (checkModule(ns)) {
           return  modules[ns];       
        }
        else {
            throw new Error("call a unregisted module: "+ns);
        }
	}
    
    return function(ns, fn){
		if(ns == undefined) return;
    
        if (fn === undefined) { //模块调用
            return callModule(ns);
        }
        else {//模块注册
            registModule(ns, fn, global);        
        }
        
    };
       
}(this));
