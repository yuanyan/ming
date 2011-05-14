//Namespaces: global

var module = (function(global, undefined){

	//Group: Native extension

	/**
	 * Function: String.prototype.trim
	 * 	ECMA-262-5 15.5.4.20
	 * 	Trims whitespace from both ends of the string
	 */
	String.prototype.trim ||
	(String.prototype.trim = function(){
		return this.replace(/^\s+/, "").replace(/\s+$/, "");
	});

	/**
	 * Function: Array.prototype.forEach
	 * 	ECMA-262-5 15.4.4.18
	 * 	Calls a function for each element in the array.
	 * 
	 * Parameters:
	 * 	callbackfn - {Object} 
	 *	thisArg - {Object} {optional}
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
	 * Function: Function.prototype.bind
	 * 	ECMA-262-5 15.3.4.5
	 * 	Sets the value of this inside the function to always be
	 * 	the value of thisArg when the function is called. Optionally,
	 * 	function arguments can be specified (arg1, arg2, etc) that will
	 * 	automatically be prepended to the argument list whenever this
	 * 	function is called.
	 *
	 * Parameters:
	 * 	thisArg - {Function} 
	 * 	arg1 - {Object} {optinal}
	 * 	arg2 - {Object} arg2 {optinal}
	 *
	 * Example:
	 *  (code)
	 *	var flatFunction = obj.method.bind(obj);
	 *  (end)
	 */
	Function.prototype.bind ||
	(Function.prototype.bind = function(thisArg/* ,[arg1],[arg2],...*/){
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


	//Group: module
	
	global.moduleConfig = global.moduleConfig||{};//配置项
	
	var config = {   //默认配置项
		"debug":true, //调试模式
		"host" : "./",  //默认服务器地址为本地相对地址
		"suffix" : ".js", //模块文件后缀
		"charset" : "utf-8" //默认字符集
	};
	
	for(var k in moduleConfig){
		config[k] = moduleConfig[k];
	};
	
	global.moduleConfig = config;

    var DOM = global.document,
		modules = new Object,//模块仓库
		moduleInFlight = new Object,
		isDomReady = false, // 表示 DOM ready 事件是否被触发过，当被触发后设为true
		isModuleReady = false, 
		isReady = false, //ready 方法执行一次
		lastLoadModule = null,
		readyHandler = [];	// DOM ready事件处理方法
    
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
        }else if(moduleInFlight[ns]){
			
		}else {
            throw new Error("call a unregisted module: "+ns);
        }
	}
	
	
	/**
	 * 加载模块
	 */
	var loadModule = function(namespace){
		if(!namespace) return;
		
		if(modules[namespace] || moduleInFlight[namespace]){
			return;
		}
		// set module in flight
		moduleInFlight[namespace] = true;
		
		if(config.host[config.host.length-1] !== '/') {
			config.host += "/";
		}
		
		var script = DOM.createElement("script");
		script.charset =  config.charset; //字符集设置
		script.type = 'text/javascript';
		//script.async = true; //异步加载属性设置（HTML5 规范）目前异步加载后无法保证脚步按加载顺序正确执行，预期在下一版本中支持异步加载脚步
		script.src = config.host + namespace.split(".").join("/") + config.suffix;; 

		var head = DOM.getElementsByTagName("head")[0] || DOM.body;
		head.appendChild(script); 
		
		isModuleReady  = false;  //更新模块加载状态
		lastLoadModule = script; //更新最后加载模块
	};
	
	/**
     * DOM Ready 处理
     */
    var ready = function(fn){
		
		readyHandler.push(fn);

        // ready方法只执行一次
        if (isReady) {
            return;
        }
		isReady = true;

        var run = function(e){	
			isDomReady = true;
			for (var i = 0, len = readyHandler.length; i < len; i++) {
				readyHandler.shift()(e);
			}
        }
        
        // 如果 当onReady()被调用时页面已经加载完毕，则直接运行处理
        if (DOM.readyState === "complete") {
            return run();
        }
        
        // DOM-level 2 标准的事件注册接口 Mozilla, Opera, webkit 都支持 
        if (DOM.addEventListener) {
            // 注册DOMContentLoaded事件的回调方法run
            DOM.addEventListener("DOMContentLoaded", run, false);
            
            // 同时注册load事件回调方法，确保被执行 
            global.addEventListener("load", run, false);
            
            //IE 的事件注册接口
        }
        else  
			if (DOM.attachEvent) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                DOM.attachEvent("onreadystatechange", run);
                
                // A fallback to window.onload, that will always work
                global.attachEvent("onload", run);
                
                // If IE and not a frame
                // continually check to see if the DOM is ready
                var toplevel = false;
                
                try {
                    toplevel = global.frameElement == null;
                } 
                catch (e) {
                }
                
                if (DOM.documentElement.doScroll && toplevel) {
                    (function(){
                        try {
                            // If IE is used, use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            DOM.documentElement.doScroll("left");
                        } 
                        catch (error) {
                            setTimeout(arguments.callee, 1);
                            return;
                        }
                        // no errors, fire
                        run();
                        
                    })();
                }
            }
    };	
	
	/*
	Function: module
		模块声明
		
	Parameters:
		ns - {String} 模块命名空间,大小写敏感
		fn - {Function} 模块
		
	Returns:
		module - {Object}
		
	Example:
		(code)
		module("lang.JSON",function(global){});
		(end)		
			
	*/	 
    var module = function(ns, fn){
		if(ns == undefined) return;
    
        if (fn === undefined) { //模块调用
            return callModule(ns);
        }
        else {//模块注册
            registModule(ns, fn, global);        
        }
        
    };
	
	/*
	Function: module.load
		模块加载
		
	Parameters:
		namespace - {String|Array} 
	*/	 
	module.load = function(namespace){
		
		if(namespace instanceof Array){
			namespace.forEach(function(v){
				loadModule(v);
			});
		}else{
			loadModule(namespace);
		}

	};
    
	/*
	Function: module.onReady
		onReady 事件注册
		
	Parameters:
		fn - {Function}
	*/	 
	module.onReady = function(fn){

		function run(){
			// 如果Dom Ready已经触发过，立即执行处理方法
			if (isDomReady) {
				fn.call(DOM);
			} 
			// 否则加入readyHandler队列中
			else {
				 ready(fn);
			}
		}
		
		//存在最后需要加载的模块并且还未加载完成
		if(lastLoadModule && !isModuleReady){ 
			
			var callback =function() {
				isModuleReady = true;
				run();
			};

			if (lastLoadModule.attachEvent) 
				lastLoadModule.attachEvent("onreadystatechange", function() {
					var target = global.event.srcElement;
					if(target.readyState == "loaded" || target.readyState === "complete")
						callback.call(target);
				});
			else if(lastLoadModule.addEventListener) 
				lastLoadModule.addEventListener("load", callback, false);

		}else{
			run();
		}
        
        
        
    };	
	
	return module;
       
}(this));
