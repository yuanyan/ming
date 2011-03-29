module("util.Loader",function(global){
				
  	var config = {   //默认配置项
		"charset" : global.moduleConfig.charset || "utf-8" //默认字符集
	};
	

	/**
	 * 加载资源文件
	 * @param {String} type 资源类型
	 * @param {String} url  资源地址 如：http://www.example.com/js/san/base.js
	 * @param {String} opt_id   元素ID
	 * @param {Function} opt_callback 加载成功后得到回调函数
	 */
	var load = function(type, url, opt_id, opt_callback){
		
		var head = document.getElementsByTagName("head")[0] || document.body;

		// Handle loading state
		var done = false;
		
		var callbackfn = function() {
				if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
					done = true;
					
					if(typeof opt_callback === "function") opt_callback(); //加载成功后的回调函数

				}
		};
		
		switch(type) {
			case 'script':		
				var script = document.createElement("script");
				script.charset = config.charset; //字符集设置
				script.type = 'text/javascript';
				opt_id && (script.id = id);
            	script.async = true; //异步加载属性设置（HTML5 规范）
				script.src = url; 
				script.onload = script.onreadystatechange = callbackfn;				
			    head.appendChild(script); 

				break;
				
			case 'style':
                var style = document.createElement('link');
                style.rel = "stylesheet";
                style.type = "text/css";
				opt_id && (style.id = id);
                style.media = "all";
                style.href = url;
				style.onload = style.onreadystatechange = callbackfn;				
                head.appendChild(style);
            
				break;	
							
			default: 
				log(type,"is Unsupported resource type!");
		}

		
	};
	
	return {
		"load":load	
	};		
	
});
