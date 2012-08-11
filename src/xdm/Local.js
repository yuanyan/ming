/**
 * Clsss: Local
 * 
 * Example:
 *  Local.postMessage("top", "hello world", "http://example.com", "http://example.com/proxy.html");
 *	function onmessage(event){
 *		var origin = event.origin,
 *			data = event.data;
 *	}
 *  Event.on(window, "message", onmessage)
 *
 * See: 
 * https://developer.mozilla.org/en/DOM/window.postMessage
 * 
 */

define("xdm/Local", function(require, exports, module) {

	var DOM = document,
	    JSON = require("lang/JSON"),
		Event = require("event/Event"),
		proxy_html;

	// remove node self
	window['__removeNode'] = function(node){
		node.parentNode.removeChild(node);
	};
	
	// target object|string
	// data string
	// targetOrigin string
	// proxy string
	function postMessage(target, data, targetOrigin, proxy){
	
		if( window['postMessage'] ){
			target = ( "string" === typeof target? eval(target): target ); // target: parent\top 
			target.postMessage(data, targetOrigin);
			
		}else{
			proxy = proxy || ( targetOrigin + '/proxy.html' );
			if(!proxy_html){
				proxy_html = DOM.createElement("div");
				DOM.body.appendChild(proxy_html);
			}
			
			var message = {
				"data": data,
				"target" : target,
				"targetOrigin":  targetOrigin,
				"origin": location.origin,
				"source": "proxy"
			}
			
			proxy_html.innerHTML = '<iframe name="' + encodeURIComponent( JSON.stringify(message) ) + '" src="' + proxy + '" onload="__removeNode(this)"></iframe>';

		}
	}

 	//EXPOSE
    return {
		postMessage: postMessage
    };

});