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

module("xdm.Local", function(global) {

	var doc = document, 
	    JSON = module("lang.JSON"),
		Event = module("event.Event"),
		proxy_html;

	// remove node self
	global['__removeNode'] = function(node){
		node.parentNode.removeChild(node);
	}
	
	// target object|string
	// data string
	// targetOrigin string
	// proxy string
	function postMessage(target, data, targetOrigin, proxy){
	
		if( global['postMessage'] ){
			target = ( "string" === typeof target? eval(target): target ); // target: parent\top 
			target.postMessage(data, targetOrigin);
			
		}else{
			proxy = proxy || ( targetOrigin + '/proxy.html' );
			if(!proxy_html){
				proxy_html = doc.createElement("div");
				doc.body.appendChild(proxy_html);
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