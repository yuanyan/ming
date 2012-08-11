/**
 *
 与JSONP不同，JSONPI允许跨域发送所有类型的请求，而JSONP只允许GET类型，
 但通过JSONPI请求，服务器返回的数据需是以下模块中的内容：
 <!DOCTYPE html>
 <html>
 <head>
 <script>document.domain = 'example.com';</script>
 </head>
 <body>
 <script>
 window.parent.jsonpi_1234567890({ 'id': '630' });
 </script>
 </body>
 </html>
 */
define("net/JSONPI", function(require, exports, module){

    var Base = require("lang/Base"),
        Uri = require("util/Uri"),
        Remote = require("xdm/Remote"),
        DOM = document;

    /**
     * Class: JSONPI
     * JSONPI请求
     *
     */
    var JSONPI = function(){
        this._opts = {
            "method" : "POST",
            "url": location.href, //请求地址，默认为当前地址
            "cache": false,    //浏览器缓存，默认不允许
            "timeout": false,  //请求过期时间，默认不过期
            "callback": "callback" //回调函数参数名
        };
        //Before 0, Loading 1, Complete 2
        this._status=0;

    };

    JSONPI.prototype.optsPrepare = function(opts){

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

    /**
     * Function: send
     * 发送请求
     *
     * Parameters:
     *  opts - {Object}
     *  callback - {Function} 成功后回调函数
     */
    JSONPI.prototype.send = function(opts, callback){

        var url,
            that = this,
            id = new Date().getTime(),
            jsonpiId = "jsonpi_"+id;

        this.jsonpiId = jsonpiId; //保存jsonpId

        window[jsonpiId] = function(){
            callback.call(this, arguments);
            that.abort();
        };

        if(Base.isString(opts)){
            url = opts;
        }else{
            //选项预处理
            opts=this._opts=this.optsPrepare(opts);
            url = opts['url']+"?"+Uri.param(opts["data"]);
        }

        url = url +"&"+opts["callback"]+"="+jsonpiId;


        //TODO 需测试Iframe是否会再次触发onload事件
        var onComplete = function(){
            if(Base.isFunction(opts["complete"])) opts["complete"]();
            that.abort();
        };

        Remote.requstWithResponse(opts["method"], url, opts["data"], jsonpiId);
    };

    /**
     * Function: abort
     * 取消请求
     */
    JSONPI.prototype.abort = function(){
        if (this.jsonpiId) {
            var iframe = DOM.getElementById(this.jsonpiId); //删除注入节点
            iframe && iframe.parentNode.removeChild(iframe);

            window[this.jsonpiId] = null;
            delete window[this.jsonpiId]; //注销回调函数
            delete this.jsonpiId;
        }
    };

    //EXPOSE
    return JSONPI;
});
