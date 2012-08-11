/*
interface Storage{
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
define("storage/LocalStorage", function(require, exports, module){
	
	var storage= window.localStorage,
        noop = function(){};

    // IE8+ Chrome 4.0+ support localStorage
    // IE 6,7 localStorage use IE userData Behavior
    // see: http://msdn.microsoft.com/en-us/library/ie/ms531424(v=vs.85).aspx
    if ('undefined' === typeof storage) {
        modulejs.onReady(function () { // make sure the document is ready
            var prefix = 'data-userdata',
                doc = window['document'],
                attrSrc = doc.body,
                html = doc.documentElement,

            // save attributeNames to <html>'s
            // data-userdata attribute
                mark = function (key, isRemove, temp, reg) {

                    html.load(prefix);
                    temp = html.getAttribute(prefix)||'';
                    reg = RegExp('\\b' + key + '\\b,?', 'i');

                    var hasKey = reg.test(temp) ? 1 : 0;

                    temp = isRemove ? temp.replace(reg, '').replace(',', '') :
                        hasKey ? temp : temp === '' ? key :
                            temp.split(',').concat(key).join(',');


                    html.setAttribute(prefix, temp);
                    html.save(prefix);

                };


            storage = {'setItem': noop,'getItem': noop,'removeItem': noop,'clear': noop};

            try{
                // add IE behavior support
                attrSrc.addBehavior('#default#userData');
                html.addBehavior('#default#userData');
            }catch(e){

            }


            storage.getItem = function (key) {
                attrSrc.load(key);
                return attrSrc.getAttribute(key);
            };

            storage.setItem = function (key, value) {
                attrSrc.setAttribute(key, value);
                attrSrc.save(key);
                mark(key);
            };

            storage.removeItem = function (key) {
                attrSrc.removeAttribute(key);
                attrSrc.save(key);
                mark(key, 1);
            };

            // clear all attributes on <body> tag that using for textStorage
            // and clearing them from the
            // 'data-userdata' attribute's value of <html> tag
            storage.clear = function () {

                html.load(prefix);

                var attrs = html.getAttribute(prefix).split(','),
                    len = attrs.length;

                for (var i = 0; i < len; i++) {
                    attrSrc.removeAttribute(attrs[i]);
                    attrSrc.save(attrs[i]);
                }

                html.setAttribute(prefix, '');
                html.save(prefix);

            };

            window.localStorage = storage;
        });
    }

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



