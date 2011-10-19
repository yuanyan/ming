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
	
	//load regist install 

    var DOM = global.document,
		modules = {},//模块仓库
		isReady = false, //domReady 方法执行一次
		isDomReady = false, // 表示 DOM ready 事件是否被触发过，当被触发后设为true	
		moduleConstructor = {},
		
		registedModules = 0,
		isModuleReady = false,
		moduleInstallQueue= []; //模块安装队列

		
    
    var checkModule = function(ns){
        return modules.hasOwnProperty(ns);
    }
    
	/**
	 * 添加模块
	 */
	var addModule = function(namespace, src){
	
		if(!namespace) return;
		
		if(namespace instanceof Array){
			
			namespace.forEach(function(v){
				addModule(v, src);
			});
		}else{
		
		    if (!checkModule(namespace)) {
				var module = {'namespace':namespace,'src':src};
				moduleInstallQueue.push(module);
			}
			else {
				throw new Error("namespace hava been registed: "+namespace);
			}
		
		}
		

    };	
	

	
	/**
	 * 加载模块
	 */
	var loadModules = function(){
	
		var host = config.host;
				
		if(host[host.length-1] !== '/') {
			host += "/";
		}
	
		moduleInstallQueue.forEach(function(module){
			
			var ns = module['namespace'],
				src = module['src'];
				
			var script = DOM.createElement("script");
			script.charset =  config.charset; //字符集设置
			script.type = 'text/javascript';
			script.async = true; //异步加载属性设置（HTML5 规范）
			script.src = src || (host + ns.split(".").join("/") + config.suffix); 

			var head = DOM.getElementsByTagName("head")[0] || DOM.body;
			head.appendChild(script); 
			
		});	

		
		

	};

	/**
	 * 注册模块
	 */
    var registModule = function(ns, fn){
        if (!checkModule(ns)) {
		
			moduleConstructor[ns] = fn;
			
			//模块注册即事件
			if( ++registedModules  ===  moduleInstallQueue.length){
			
				installModules();
			}
  			
            //console.log(ns + " module registed!");
        }
        else {
            throw new Error("namespace hava been registed: "+ns);
        }
		
		
        
    };	
		
	/**
	 * 安装模块
	 */	
	var installModules = function(){
	
		moduleInstallQueue.forEach(function(module){
			
			var ns = module['namespace'],
				fn = moduleConstructor[ns];
				
            modules[ns] = fn(global);			
			
		});		
		
		isModuleReady = true;
		if(isDomReady){
			runReadyHandler();
		}
		
	}
	
	/**
	 * 调用模块
	 */	
	var callModule = function(ns){
		if (checkModule(ns)) {
           return  modules[ns];       
        }else {
            throw new Error("call a unregisted module: "+ns);
        }
	};

	
	var runReadyHandler = function(e){

		for (var i = 0, len = modules['_readyHandler'].length; i < len; i++) {
			modules['_readyHandler'].shift()(e);
		}
	
	};
	/**
     * DOM Ready 处理
     */
    var domReady = function(fn){

        // ready方法只执行一次
        if (isReady) {
            return;
        }
		isReady = true;
		
		loadModules();

        var run = function(e){	
			isDomReady = true;
            if(isModuleReady){
               runReadyHandler(e);
            }
        };
        
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
            registModule(ns, fn);        
        }
        
    };
	

	
	
	/*
	Function: module.load
		模块加载
		
	Parameters:
		namespace - {String|Array}
		src - {String}
	*/	 
	module.load = function(namespace, src){
			
		addModule(namespace, src);

	};
    
	/*
	Function: module.onReady
		onReady 事件注册
		
	Parameters:
		fn - {Function}
	*/	 
	module.onReady = function(fn){
		
		if(modules['_readyHandler']){
			modules['_readyHandler'].push(fn);
		}else{
			modules['_readyHandler'] = [fn];
		}
		
		domReady(function(e){			
			if(isModuleReady){
				fn(e);
				//fn.isCalled = true;
			}	
		});
	 
        
    };	
	
	return module;
       
}(this));
