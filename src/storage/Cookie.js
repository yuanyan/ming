/*
interface Storage{
	number length();
	string key(number index);
	void set(string key,object val);
	object get(strin key);
	void reomve(string key);
}
Cookie implement Storage
*/

/*
 Class: Cookie
	Cookie操作的静态工具类
	TODO：添加storage事件，当数据被修改、添加、删除时触发storage事件
*/
module("storage.Cookie", function(global){
	
	var cookie=global.document.cookie;
    
    /*
	Function: set
		设置cookie

	Parameters:
		name - Object
		value - Object
		expires - Object
		path - Object
		domain - Object
		secure - Object
     */
    var setCookie = function(name, value, expires, path, domain, secure){
        var curcookie = name + "=" + encodeURIComponent(value) + ((expires) ?
		 "; expires=" + expires.toGMTString() : "") + ((!!path) ?
		  "; path=/" + path + "/" : "; path=/") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
		
		if ((name + "=" + encodeURIComponent(value)).length <= 4000) 
           document.cookie = curcookie;
        else 
            if (confirm("Cookie exceeds 4KB and will be cut!")) 
                document.cookie = curcookie;
    };
    
    /*
	Function: get
		取出cookie
		
	Parameters:
		name - string
		
	Returns:
		string
    */
    var getCookie = function(name){
        var prefix = name + "=";
        var cookieStartIndex = cookie.indexOf(prefix);
        if (cookieStartIndex == -1) 
            return null;
        var cookieEndIndex = cookie.indexOf(";", cookieStartIndex + prefix.length);
        if (cookieEndIndex == -1) 
            cookieEndIndex = cookie.length;
        return decodeURIComponent(cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
    };
	
    /*
	Function: remove
		清除cookie
		
	Parameters:
		name - string
		path - string
		domain - string
    */	 
    var removeCookie = function(name, path, domain){
        if (getCookie(name)) {		
			setCookie(name, "", new Date(0), path, domain);
        }
    };

    /*
	Function: length
		返回当前cookie已存项目数
		
	Returns:
		number
    */	 
	var length = function(){
		var items = cookie.split(';');
		return items.length;
	};
	
    /*
	Function: key
		按索引值获取存储项的key
		
	Parameters:
		index - Number
		
	Returns:
		string
    */	 
	var key = function(index){
		
		var key=null, items = cookie.split(";");
		
		if(items[index]){
			key = items[index].split("=")[0];
		}

		return key;
		
	};
	
    return {
		"length": length,
		"key": key,
		"set": setCookie,
		"get": getCookie,
		"remove": removeCookie
	}
    
});

/**
 * NOTES:
 *
 *   - 与jQuery只用cookie方法这种简洁的操作方式相比，
 *     目前modulejs的API设计上在可扩展性和可读性上更好，更适合企业应用开发
 *
 */