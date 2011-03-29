/**
 * @name Request
 * @class
 * 支持before loading complete success error abort事件
 * 
 */
module("net.Request",function (global){
	
	var Base = module("lang.Base"),
		Uri = module("util.Uri");
	
	var Request= function(){
		this._xhr = this.createRequest();
		this._opts = {
		        "url": location.href, //请求地址，默认为当前地址
		        "method": 'POST',  //请求方式，默认为POST
		        "async": true,     //请求处理方式，异步：true，同步：false
		        "cache": false,    //浏览器缓存，默认不允许
		        "timeout": false,  //请求过期时间，默认不过期
		        "dataType": 'text' //请求从服务器返回的数据类型，默认为text
	    	};	
		//Before 0, Loading 1, Complete 2
		this._status=0;	
	};
	
	
	/**
     * 创建XMLHttpRequest对象
     * @return {XMLHttpRequest} xhr
     */
    Request.prototype.createRequest= function(){
        var XHRObjects = [function(){
            return new ActiveXObject('Msxml2.XMLHTTP')
        }, function(){
            return new XMLHttpRequest()
        }, function(){
            return new ActiveXObject('Microsoft.XMLHTTP')
        }, function(){
            return new ActiveXObject('Msxml3.XMLHTTP')
        }];
        
        var xhr = false; //初始化状态当前不支持XMLHttpRequest，返回false
        for (var i = 0; i < XHRObjects.length; i++) {
            try {
                xhr = XHRObjects[i]();
            } 
            catch (e) {
                continue;
            }
			
			Request.prototype.createRequest=XHRObjects[i]; //使 createRequest方法只初始检测一次，成功后替换为当前浏览器支持的XHR对象创建方法
            break;
        }
		
        if (!xhr) 
            Base.log('Cannot create XMLHttpRequest.');
        return xhr;
        
    };
	
    /**
     * 设置请求头信息
     * @param {Object} name
     * @param {Object} value
     */
     Request.prototype.setHeader = function(name, value){
		var key;
        if (Base.isObject(name)) {//处理以对象形式封装的header参数
            for (key in name) {
                this._xhr.setRequestHeader(key, name[key]);
            }
        }else {
            this._xhr.setRequestHeader(name, value);
        }
    };
	
    /**
     * 发送请求
     * @param {XMLHttpRequest} xhr
     * @param {Object} opts
     */
     Request.prototype.send = function(opts){
		//选项预处理
		opts=this._opts=this.optsPrepare(opts);
		var xhr=this._xhr;

        //method: CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, TRACE, or TRACK
		//其中HEAD请求只返回响应的HTTP头部，而不包含响应内容
        //通常在只需要获取文件的最后修改时间 时，会以HEAD方式请求 
        var method = opts['method'].toUpperCase();
		var url=opts['url'];
		var async=opts['async'];
      	
        xhr.open(method, url, async);
		
		//服务器识别当前是普通请求还是Ajax请求
		this.setHeader({
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		});
		 //当以POST方式请求时，需设置Content-type头信息
		if (method == "POST") {
			this.setHeader('Content-type', 'application/x-www-form-urlencoded');
		}	
		
		//请求前事件
		if (opts['before'] && this._status == 0) {
			opts['before'](xhr,opts);
        }
		

		var that=this;
        xhr.onreadystatechange = function(){ //当请求就绪状态发生改变时，处理方法被执行
        	
            //xhr.readyState五种状态 :
			//UNSENT 0, OPENED 1, HEADERS_RECEIVED 2, LOADING 3, DONE 4
			if(opts['loading'] && (xhr.readyState == 2||xhr.readyState == 3)){
				//请求状态修改
				if (that._status != 1) {
					that._status = 1;
					opts['loading'](xhr, opts);
				}			
				return;
			}    
            if (xhr.readyState == 4) {
				//请求状态修改
				that._status=2;
				//请求成功事件，正常情况下期望HTTP status返回200 OK，
				//但Opera有时候会返回304 Not Modified,即无改动
                if (opts['success'] && (xhr.status == 200 || xhr.status == 304)) {
					
					if (opts['dataType'].toLowerCase() == "xml") {
						opts['success'](xhr.responseXML, xhr, opts);
					}else{
						opts['success'](xhr.responseText, xhr, opts);
					}
                }
                //请求错误事件
                if (opts['error'] && xhr.status != 200 && xhr.status != 304) {
                    opts['error'](xhr,opts);
                }
                //请求完成事件,请求成功或错误均回调
                if (opts['complete']) {	
					opts['complete'](xhr,opts);
				}
				return;
            }
			
        };
        
        xhr.send(opts['data']); //发送请求数据 postData ， GET方式时为null
     
    };
	
    /**
     * 取消请求
     */
     Request.prototype.abort = function(){
        // 取消请求前检查当前请求状态
        if (this._xhr && this._status != 2) {
			
            this._xhr.abort();
			
            if (this._opts['abort']) {
                this._opts['abort']();
            }
        }
    };
	
    /**
     * 发送选项预处理
     * @param {Object} opts
     */
     Request.prototype.optsPrepare = function(opts){
    	var data=opts['data']||{},form="";
		
        if (opts['form']) {
            form = this.serializeForm(opts['form']);
        }
	
		if(Base.isString(data)){
			data=Uri.deparam(data);
		}

		//浏览器缓存，请求中添加时间标签，不同请求浏览器不缓存
		if (!opts['cache']) {
			data['_t'] = new Date().getTime();
		}

		//合并data与form中的数据，data数据优先级比form高
   		opts['data']  = form + Uri.param(data);
	
		//请求过期检查
		if ( opts['async'] && opts['timeout'] > 0 ) {
			var that = this;
			setTimeout(function() {
					that.abort();
			}, opts['timeout']);
		}
		
        return Base.mix(opts,this._opts);
        
    };
	
	/**
	 * 序列化表单
	 * @param {Object|String} form
	 * @return {String} data 
	 */
     Request.prototype.serializeForm = function(form){
        var fElements = form.elements || document.forms[form].elements, 
			add = function(name,val){return (encodeURIComponent(name)+"="+encodeURIComponent(val)+"&").replace(/%20/g, "+")},  //规则定义
			hasSubmit = false,  
			options, 
			val, 
			data = "", //初始数据为空 
	     	name, //元素name
	     	type; //元素类型
			
        Base.each(fElements, function(element){
            name = element.name;
            type = element.type;
            //元素name属性必须被设置,其中form.elements数组不引用image类型的input元素
            if (name && !/file|reset|button|undefined/i.test(type)) {
                if (/select-(one|multiple)/i.test(type)) { //HTMLSelectElement
                    Base.each(element.options, function(opt){
                        if (opt.selected) {
                            var val=(opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text;
                       		data += add(name,val);
					    }
                    });
                           
                }else if ( !( /radio|checkbox/i.test(type) && !element.checked ) && !( type == 'submit' && hasSubmit ) ) { 				   
						data += add(name,element.value);
                        hasSubmit = /submit/i.test(type);
                }
            }
            
        }); 
 
        return data;
    };
	
	//EXPOSE
	return Request;
	 
});
