/**
 * Class: Ajax
 */
module("net.Ajax", function(global){
	
	//IMPORT
	var Base = module("lang.Base"),
		Request = module("net.Request");
	
	/**
	 * Function: ajax
	 * AJAX请求
	 * 
	 * Parameters:
	 * 	opts - {Object}
	 * 
	 * Example:
	 * (code)
	 *  ajax({
	 *   url: 'ajax_demo/sample.json',
	 *   method:'POST',
	 *   data: {'id': '1'}, 
	 *   form: 'myForm',
	 *
	 *   //默认所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为false。
	 *   //注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
	 *   async:ture, 
	 *   cache: false,
	 *   timeout: 100, 
	 *   dataType:xml json text(html) 
	 *   success: function(xhr, opts) {
	 *     var obj = JSON.parse(response.responseText);
	 *      console.dir(obj);
	 *   },
	 *   error: function(xhr, opts) {
	 *      console.log('server-side failure with status code ' + response.status);
	 *   }
	 * });
	 * (end)
	 */
	var ajax= function(opts){
		var request = new Request;
		return request.send(opts);
	};
	
	/**
	 * Function: get
	 * GET方式请求
	 * 
	 * Parameters:
	 * 	url - {Object} 
	 * 	data - {Object} 
	 * 	success - {Object} 
	 * 	type - {Object}
	 */
	var get= function( url, data, success, type ) {
		// 如果没有data，则shift参数位置
		if ( Base.isFunction( data ) ) {
			type =  success;
			success = data;
			data = {}; //data = {} 比  data = null 字符少
		}

		return ajax({
			'method': "GET",
			'url': url,
			'data': data,
			'success': success,
			'dataType': type
		});
	};
	
	/**
	 * Function: post
	 * POST方式请求
	 * 
	 * Parameters:
	 * 	url - {Object} 
	 * 	data - {Object} 
	 * 	success - {Object}
	 * 	type - {Object} 
	 */
	var post= function( url, data, success, type ){
		// 如果没有data，则shift参数位置
		if ( Base.isFunction( data ) ) {
			type = success;
			success = data;
			data = {}; 
			
		}

		return ajax({
			'method': "POST",
			'url': url,
			'data': data,
			'success': success,
			'dataType': type
		});
		
	};
	
	//EXPOSE
	return {
		"ajax": ajax,
		"get": get,
		"post": post		
	};
	
});
