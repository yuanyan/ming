/**
 * 
 * @name LocalStorage
 * @class
 *
 * localStorage操作的静态工具类
 * localStorage提供在cookie之外存储会话数据，并且localStorage不会像cookie一样会在每次请求头中发回服务器
 */

/*
interface Storage{
	public length();
	public key(Number index);
	public set(String key, Object val);
	public get();
	public reomve();
}
implement Storage
*/
module("storage.LocalStorage", function(global){
	
	var storage=global.localStorage;
    
	var length = function(){
		return storage.length;
	};

	var key= function(index){  //本地方法
		
		return storage.key(index);
	} 	
	
	var set = function(key,val){

		return storage.setItem(key,val);
	}
	
	//var set = localStorage.setItem.call(localStorage,key,val);

	var get = function(key){	
		return storage.getItem(key);
	}
	
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



