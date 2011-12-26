/**
 * Clsss: Local
 *
 * https://developer.mozilla.org/en/DOM/window.postMessage
 */

module("xdm.Local", function(global) {

	var doc = document, 
		Event = module("event.Event");

	var reURI = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;
	var xdm_proxy;

	function getLocation(url){
	
		if (!url) {
			throw new Error("url is undefined or empty");
		}
		
		if (/^file/.test(url)) {
			throw new Error("The file:// protocol is not supported");
		}
		
		var m = url.toLowerCase().match(reURI);
		var proto = m[2], domain = m[3], port = m[4] || "";
		if ((proto == "http:" && port == ":80") || (proto == "https:" && port == ":443")) {
			port = "";
		}
		return proto + "//" + domain + port;
	}
	
	function getOrigin(event){
        if (event.origin) {
            // This is the HTML5 property
            return getLocation(event.origin);
        }
        if (event.uri) {
            // From earlier implementations 
            return getLocation(event.uri);
        }
        if (event.domain) {
            // This is the last option and will fail if the 
            // origin is not using the same schema as we are
            return location.protocol + "//" + event.domain;
        }
        throw "Unable to retrieve the origin of the event";
    }
	
	function onMessage(event){
        var origin = getOrigin(event),
			data = event.data,
			source = event.source;

    }
	
	window['__removeNode'] = function(node){
		node.parentNode.removeChild(node);
	}
	
	
	function postMessage(target, message, targetOrigin, origin, proxy){
		if(window['postMessage']){
			target = ("string" === typeof target? eval(target): target);
			target.postMessage(message, targetOrigin);
			
		}else{

			proxy = proxy || 'http://' + origin + '/proxy.html#';
			
			if(!xdm_proxy){
				xdm_proxy = doc.createElement("div");
				doc.body.appendChild(xdm_proxy);
			}
			
			xdm_proxy.innerHTML = '<iframe name="' + encodeURIComponent(message) + '" src="' + proxy + '" onload="__removeNode(this)"></iframe>';

				
		}
	}

 	//EXPOSE
    return {
		postMessage: postMessage
    };

});