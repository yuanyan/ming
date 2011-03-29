/**
 * @name event.DomReady
 * @namespace
 */
module("event.DomReady", function(global){

    //IMPORT
    var DOM = global.document;
    
    // 表示 DOM ready 事件是否被触发过，当被触发后设为true
    var isReady = false;
    
    // DOM ready事件处理方法
    var readyHandler = [];
     
    /**
     * @private
     * DOM Ready 处理
     */
    var ready = function(){
        // 如果Dom Ready已经触发过,直接返回
        if (isReady) {
            return;
        }
        
        isReady = true;

        var run = function(e){
            for (var i = 0, len = readyHandler.length; i < len; i++) {
                readyHandler.shift()(e);
            }
        }
        
        // 如果 当onReady()被调用时页面已经加载完毕，则直接运行处理
        if (DOM.readyState === "complete") {
            return run();
        }
        
        // DOM-level 2 标准的事件注册接口 Mozilla, Opera, webkit 都支持 
        if (DOM.addEventListener) {
            // 注册DOMContentLoaded事件的回调方法run
            DOM.addEventListener("DOMContentLoaded", run, false);
            
            // 同时注册load事件回调方法，确保被执行 
            window.addEventListener("load", run, false);
            
            //IE 的事件注册接口
        }
        else 
            if (DOM.attachEvent) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                DOM.attachEvent("onreadystatechange", run);
                
                // A fallback to window.onload, that will always work
                window.attachEvent("onload", run);
                
                // If IE and not a frame
                // continually check to see if the DOM is ready
                var toplevel = false;
                
                try {
                    toplevel = window.frameElement == null;
                } 
                catch (e) {
                }
                
                if (DOM.documentElement.doScroll && toplevel) {
                    (function(){
                        try {
                            // If IE is used, use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            DOM.documentElement.doScroll("left");
                        } 
                        catch (error) {
                            setTimeout(arguments.callee, 1);
                            return;
                        }
                        // no errors, fire
                        run();
                        
                    })();
                }
            }
    };
    
    /**
     * DOMReady 事件注册
     * @param {Function} fn
     */
    var onReady = function(fn){
    
        // 如果Dom Ready已经触发过，立即执行处理方法
        if (isReady) {
            fn.call(DOM);
            // 否则加入readyHandler队列中
        }
        else 
            if (readyHandler) {
                readyHandler.push(fn);
            }
        
        ready();
        
    };
    
    
    
    //EXPOSE
    return {
        "onReady": onReady
    };
});
