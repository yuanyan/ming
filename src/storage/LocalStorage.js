/*
interface Storage{
	number length();
	string key(number index);
	void set(string key,object val);
	object get(strin key);
	void reomve(string key);
}
LocalStorage implement Storage
*/

/*
	Class: LocalStorage
	
		localStorage操作的静态工具类
		
		localStorage提供在cookie之外存储会话数据，并且localStorage不会像cookie一样会在每次请求头中发回服务器
*/
module("storage.LocalStorage", function(global){
	
	var storage=global.localStorage;

    /*
	Function: length
		获取当前localStorage的长度
		
	Returns:
		number
    */    
	var length = function(){
		return storage.length;
	};

    /*
	Function: key
		按索引值获取存储项的key
		
	Parameters:
		index - number
		
	Returns:
		指定项key值
    */ 	
	var key= function(index){  //本地方法
		
		return storage.key(index);
	} 	

    /*
	Function: set
		设置localStorage
		
	Parameters:
		key - string
		val - Object
		
    */ 	
	var set = function(key,val){

		return storage.setItem(key,val);
	}
	
	//var set = localStorage.setItem.call(localStorage,key,val);

    /*
	Function: get
		获取localstorage中的值
		
	Parameters:
		key - string
		
	Returns:
		object
    */ 	
	var get = function(key){	
		return storage.getItem(key);
	}

    /*
	Function: remove
		删除localStorage中指定项
		
	Parameters:
		key - string
		
    */ 	
	var remove = function(key){	
		return storage.removeItem(key);
	}	
	
    return {
		"length": length,
		"key": key,
		"set": set,
		"get": get,
		"remove" : remove
	}
    
});

/**
 * NOTES:
 *
 *
 */



