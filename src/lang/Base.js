module("lang.Base",function(global){
	
    var DOM = global.document,
		toString = Object.prototype.toString,
		config = global.moduleConfig;

    /**
     * 对象是否可以迭代 ：原生数组 NodeList HTMLCollection
     * @lends san
     * @param {Object} obj
     */
    var isIterable = function(obj){
        //array or arguments
        if (isArray(obj) || obj.callee) {
            return true;
        }
        //node list type
        if (/NodeList|HTMLCollection/.test(toString.call(obj))) {
            return true;
        }
        //NodeList has an item and length property
        //IXMLDOMNodeList has nextNode method, needs to be checked first.
        return ((typeof obj.nextNode != 'undefined' || obj.item) && isNumber(obj.length));
    };
        
    /**
     * 转化任意对象为数组
     * @lends san
     * @param {Object} obj
     * @param {Number} opt_start
     * @param {Number} opt_end
     * @return (Array) array
     */
    var toArray = function(obj,opt_start,opt_end){
		//the null and ndefined return empty array
	    if (obj === null || obj === undefined) return [];
		
		var len = obj.length;
		
        //convert other object, but the strings and functions also have 'length' property
        if (typeof len !== 'number' || isString(obj) || isFunction(obj)) {
            return [obj];
        }
		
		var start= opt_start || 0, end = opt_end || len;	
		
		// ie 6/7/8 不支持用 slice 转换 NodeList(IE 9 支持), 降级到普通方法
		// In Internet Explorer it throws an error that it can't run Array.prototype.slice.call(nodes)
		// because a DOM NodeList is not a JavaScript object. 
        if (obj.item && DOM.attachEvent) {
            var ret = [];
            for (var i = 0; i < len; ++i) {
                ret[i] = obj[i];
            }
            return ret.slice(start , end);
        }

        // other array-like object
        return Array.prototype.slice.call(obj, start, end);
	};
	

    /**
     * 数组判断
     * @param {Object} obj
     * @retrun {Boolean}
     */
    var isArray = function(obj){
        //首选浏览器内置提供的isArray方法
        if (Array.isArray) {
            return Array.isArray(obj);
        }
        
        return !!(obj && //是否为真值
        typeof obj === "object" && //是否为 object array 或  null 对象
        typeof obj.length === "number" && //是否有数值类型的length属性
        !obj.propertyIsEnumerable("length")); //length属性是否可以枚举，只有数组中length属性不可枚举
        
        //下面是其他判断数组的方法，jQuery使用了此方法，在chrome下性能上不及目前的方法，
		//测试结果相差将近一倍
        //toString.call(object) == "[object Array]";
		
		//通过instanceof 操作符判断
		//obj instanceof Array
    };
    
    /**
     * 函数判断
     * @param {Object} obj
     * @retrun {Boolean}
     */
    var isFunction = function(obj){
        return typeof obj === "function";
        //toString.call(obj)=="[object Function]"
    };
    
    /**
     * 数字判断
     * @param {Object} obj
     * @return {Boolean} 为无穷大Infinity与负无穷大-InfInity时返回false
     */
    var isNumber = function(obj){
		//当obj通过 new Nubmer 封装类构造时   typeof obj === "object" 
        return (typeof obj === "number"||obj instanceof Number) && isFinite(obj);
		//toString.call(obj)==="object Number"
	};
    /**
     * 字符串判断
     * @param {Object} obj
     * @return {Boolean}
     */
    var isString = function(obj){
		//当obj通过 new String 封装类构造时   typeof obj === "object" 
        return typeof obj === "string"||obj instanceof String;
		
		//toString.call(obj)==="[object String]"
    };
    
    /**
     * 布尔判断
     * @param {Object} obj
     * @return {Boolean}
     */
    var isBoolean = function(obj){
		//当obj通过 new Boolean 封装类构造时   typeof obj === "object" 
        return typeof obj === "boolean"||obj instanceof Boolean;
		
		//toString.call(obj)==="object Boolean"
        
    };
    
    /**
     * 日期判断
     * @param {Object} obj
     * @return {Boolean}
     */
    var isDate = function(obj){
        return toString.call(obj) === "[object Date]";
    };
	
	/**
	 * 对象判断
	 * @param {Object} obj
	 */
	var isObject =function(obj){
		return toString.call(obj) === "[object Object]";
	};
    
    /**
     * 空对象判断
     * @param {Object} obj
     * @retrun {Boolean}
     */
    var isEmptyObject = function(obj){
        for (var key in obj) {
            return false;
        }
        return true;
    };
	
    /**
     * 空判断
     * 
     * @example
     * san.isEmpty(null) === true
     * san.isEmpty(undefined) === true
     * san.isEmpty([]) === true
     * san.isEmpty("")===true
     * san.isEmpty("",false) === true
     * san.isEmpty({})=== true
     * 
     * @param {Mixed} value The value to test
     * @param {Boolean} opt_allowBlank  true to allow empty strings (defaults to false)
     * @return {Boolean}
     */
    var isEmpty = function(obj, opt_allowBlank){
        return obj === null || obj === undefined || ((isArray(obj) && !obj.length)) ||(isObject(obj) && isEmptyObject(obj))|| (!opt_allowBlank ? obj === "" : false);
    };
	
    /**
     * 回掉函数迭代处理
     * @param {Array|NodeList|Mixed} object 
     * @param {Function} callback(value,name) 回掉函数
     * @return {Object} obj 返回传入的对象
     */
    var each = function(obj, callback){
        var name, i = 0, 
		len = obj.length, 
		isObj = len === undefined || isFunction(obj);
        
        if (isObj) {
            for (name in obj) {
                if (callback.call(obj[name], obj[name], name) === false) {
                    break;
                }
            }
        } else { //可迭代对象(原生数组 NodeList HTMLCollection)
            for (var value = obj[0]; i < len && callback.call(value, value, i) !== false; value = obj[++i]) {
            }
        }
            
        return obj;
        
    };

	
    /**
     * 对象属性复制,默认不覆盖对象已有的属性, 目标对象会被修改
     * @lends san
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @paream {Boolean} override 覆盖模式 {optional}
     * @return {Object} target 对象
     */
    var mix = function(/**{Object}...**/){
		var i=1,
		len=arguments.length,
		target=arguments[0]||{},
		source,
		name,
		override=false;
		
		//最后一个参数为boolean类型即为覆盖模式参数
		if(typeof arguments[len-1] === "boolean"){
				--len;
				override=arguments[len-1];
		}	
		
		for(;i<len;++i){
			source=arguments[i];
			for(name in source){
				if(typeof target[name] === "undefined"){
					target[name]= source[name];
				}else{
					!override||(target[name]= source[name]);				
				}
			}
		}
    
        return target;
    };	
    
    /**
     * 抛出异常
     * @param {String} msg
     * @throw {String} "Error: " + msg
     */
    var error = function(msg){
		if (config.debug)
            throw new Error(msg);
    };
	
    /**
     * 日志记录
     * @param {...String} msg
     */
    var log = function(){
		
        if (config.debug && global['console'] !== undefined && global['console'].log) {
			var logs=[];
            for (var i = 0; i < arguments.length; ++i) {
				logs.push(arguments[i]);
			}  
			
			global['console'].log(logs.join(' '));
        }   
        return this;
    };
    
    /**
     * 命名空间注册
     * @param {...String} ns 命名空间
     * @param {Object=} opt_global 全局命名空间
     * @return {Object} 返回指定的名称空间，如果该名称空间不存在就创建它。
     * @example 
     *  san.namespace("lang.JSON",san); //等同于San.namespace("san.lang.JSON"); 
     *  san.namespace("lang.JSON","lang.Array",san);
     * 
     */
    var namespace = function(){
		var len = arguments.length,ns=global,i,j,l;
		
		if(isObject(arguments[len-1])){	 //末尾参数类型判断
			ns=arguments[len-1];
			len--;
		}
		
		for (i = 0; i < len; i++) {
			var arr = ("" + arguments[i]).split(".");
			
			for (j = 0, l = arr.length; j < l; j++) {
				ns = ns[arr[j]] = ns[arr[j]] || {};
				
			}
		}
        
        return ns;
        
    };


   /**
    * 测试输出
    * @param {Object} obj
    */ 
   var dump = function(obj){
        var msg="Type:"+toString.call(obj)+" "+obj+"\n",
            name;
            
		if (isObject(obj)) {
			var hasPM = "Object Property&Method:\n";
			for (name in obj) {
				if (hasPM) {
					msg += hasPM;
					hasPM = false;
				}
				msg += ("  " + name + ":" + obj[name] + "\n");
			}
		}
		log(msg);
		
	};
	
       return  {
		   
		   "isIterable":isIterable,
           
           "isArray": isArray,
           
           "isFunction": isFunction,
           
           "isObject": isObject,
		   
		   "isEmptyObject": isEmptyObject,
           
           "isNumber": isNumber,
           
           "isString": isString,
           
           "isBoolean": isBoolean,
           
           "isDate": isDate,
           
           "isEmpty": isEmpty,
		   
		   "toArray": toArray,
		   
		   "each": each,
		   
		   "mix": mix,
           
           "log": log,
           
           "error": error,
           
           "namespace": namespace,
		   
		   "dump": dump
       };
    
    
});











