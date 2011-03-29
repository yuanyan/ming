/**
 * 
 * @name Cookie
 * @class
 *
 * Cookie操作的静态工具类
 * TODO：添加storage事件，当数据被修改、添加、删除时触发storage事件
 * 
 */

/*
interface Storage{
	attribute length;
	public key();
	public set();
	string get();
	void reomve();
}
implement Storage
*/

module("storage.Cookie", function(global){
	
	var cookie=global.document.cookie;
    
    /**
     * 设置cookie
     * @param {Object} name
     * @param {Object} value
     * @param {Object} expires
     * @param {Object} path
     * @param {Object} domain
     * @param {Object} secure
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
    
    /**
     * 取出cookie
     * @param {Object} name
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
	
    /**
     * 清除cookie
     * @param {Object} name
     * @param {Object} path
     * @param {Object} domain
     */
    var removeCookie = function(name, path, domain){
        if (getCookie(name)) {		
			setCookie(name, "", new Date(0), path, domain);
        }
    };
	
	/**
	 * return the number of cookie item 
	 * @return {Number} number
	 */
	var length = function(){
		var items = cookie.split(';');
		return items.length;
	};
	
	/**
	 * 按索引取存储项
	 * @param {Number} index
	 * @return {Object} item
	 */
	var key = function(index){
		
		var item=null,items = cookie.split(";");
		
		if(items[index]){
			item = items[index].split("=");
			var key=item[0],val= decodeURIComponent(item[1]);
			item = {key:val};			
		}
				
		return item;
		
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


/*
  Copyright (c) 2006 Klaus Hartl (stilbuero.de)
  Dual licensed under the MIT and GPL licenses:
  http://www.opensource.org/licenses/mit-license.php
  http://www.gnu.org/licenses/gpl.html  
 */	
	/**
	 * cookie操作的简洁方法
	 * 
	 * @param {Object} name 
	 * @param {Object} value 
	 * @param {Object} options
	 */
	/**
    var cookie = function(name, value, options){
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (cookie && cookie != '') {
                var cookies = cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
	
**/
