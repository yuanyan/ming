module("net.JSONP", function(global){
	
	var Base = module("lang.Base"),
		Uri = module("util.Uri"),
		Loader = module("util.Loader");
	
	var JSONP = function(){
		this._opts = {
		        "url": location.href, //请求地址，默认为当前地址
		        "cache": false,    //浏览器缓存，默认不允许
		        "timeout": false,  //请求过期时间，默认不过期
				"callback": "callback", //回调函数参数名
	    	};	
		//Before 0, Loading 1, Complete 2
		this._status=0;
		
	};

	JSONP.prototype.optsPrepare = function(opts){

    	var data=opts['data']||{};
	
		if(Base.isString(data)){
			data=Uri.deparam(data);
		}
		//浏览器缓存，请求中添加时间标签，不同请求浏览器不缓存
		if (!opts['cache']) {
			data['_t'] = new Date().getTime();
		}
		
		if ( opts['timeout'] && opts['timeout'] > 0 ) {
			var that = this;
			setTimeout(function() {
					that.abort();
			}, opts['timeout']);
		}

       return Base.mix(opts,this._opts);	
		
	};		
	
	JSONP.prototype.send = function(opts,callback){
		
		var url,
			id = new Date().getTime(),
			jsonpId = "jsonp_"+id;
			
		this.jsonpId = jsonpId; //保存jsonpId
		module[jsonpId] = callback; //回调函数cache在module全局命名空间下	
		
		if(Base.isString(opts)){	
			url = opts;
		}else{
			//选项预处理
			opts=this._opts=this.optsPrepare(opts);
			url = opts['url']+"?"+Uri.param(opts["data"]);
		}
		
		url = url +"&"+opts["callback"]+"="+callbackId;
		
		var that = this;
		var onComplate = function(){
			if(Base.isFunction(opts["complate"])) opts["complate"]();
			that.abort();
		};
		
		Loader.load("script", url, jsonpId, onComplate);
	};

	JSONP.prototype.abort = function(){
		if (this.jsonpId) {
			var script = global.document.getElementById(this.jsonpId); //删除注入节点
			script && script.parentNode.removeChild(script);
			
			delete module[this.jsonpId]; //注销回调函数
			delete this.jsonpId;
		}
	};

	//EXPOSE
	return JSONP;
});
