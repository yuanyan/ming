/**
 * Class: Dom
 */
module("dom.Dom",function(global){
	
	//IMPORT
	var Node = module("dom.Node"),
		Base = module("lang.Base"),
		query = module("dom.query");
	
	var DOM= document,
		Dom= new Node(DOM);
	
	
	
	/*
	 * Node.ELEMENT_NODE = 1; // Element
	 * Node.ATTRIBUTE_NODE = 2;               // Attr
	 * Node.TEXT_NODE = 3;                    // Text
	 * Node.CDATA_SECTION_NODE = 4;           // CDATASection
	 * Node.PROCESSING_INSTRUCTION_NODE = 7;  // ProcessingInstruction
	 * Node.COMMENT_NODE = 8;                 // Comment
	 * Node.DOCUMENT_NODE = 9;                // Document
	 * Node.DOCUMENT_TYPE_NODE = 10;          // DocumentType
	 * Node.DOCUMENT_FRAGMENT_NODE = 11;      // DocumentFragment
	 */	
	
	/**
	 * Function: isNode
	 * 是否为节点
	 * 
	 * Parameters:
	 *  node - {*}
	 *  
	 * Returns: 
	 * 	{Boolean}
	 */
    var isNode = function(node){     
        return (node && node.nodeType) || node instanceof Node;
    };
		
	/**
	 * Function: create
	 * 创建元素节点
	 * 
	 * Parameters:
	 *   tagName- {String} 元素标签名
	 *   
	 * Returns: 
	 * 	{Node} element
	 */
	var create = function(tagName){
		var elem=DOM.createElement(tagName);	
		return new Node(elem);
	};
	
	/**
	 * Function: remove
	 * 移除符合选择器的所有节点
	 * 
	 * Parameters:
	 *  selector - {String}
	 */	
	var remove=function(selector){ 
		
		query(selector).each(function(node){
			node.destroy();
		});
			
	};
	
	
    /**
     * Function: addStyle
     * 添加CSS样式
     * 
     * Parameters:
     *  cssText - {String}
     */
    var addStyle = function(cssText){
        var elem = create('style');
		
        // 此处需先把style节点添加至head下 
        DOM.getElementsByTagName('head')[0].appendChild(elem);
        
        if (elem.styleSheet) { // IE
            elem.styleSheet.cssText = cssText;
        }
        else { // W3C
            elem.appendChild(DOM.createTextNode(cssText));
        }
		
		return this;
    };
	
    /**
     * Function: getWH
     * 获取窗口长宽
	 *
	 *	window.innerHeight/Width
	 *		Provided by most browsers, but not Internet Explorer 8-, and even in Internet Explorer 9+, it is not available in quirks mode.
	 *	document.body.clientHeight/Width
	 *		Provided by many browsers, including Internet Explorer.
	 *	document.documentElement.clientHeight/Width
	 *		Provided by most DOM browsers, including Internet Explorer.
	 *
	 * Returns:
	 *  {"width": width, "height": height}
	 *
	 * See: 
	 * http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
     */
	var getWindowWH = function(){
		var width = 0, height = 0;
		if( typeof( global.innerWidth ) == 'number' ) {
			//Non-IE
			width = global.innerWidth;
			height = global.innerHeight;
		} else if( DOM.documentElement && ( DOM.documentElement.clientWidth || DOM.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			width = DOM.documentElement.clientWidth;
			height = DOM.documentElement.clientHeight;
		} else if( DOM.body && ( DOM.body.clientWidth || DOM.body.clientHeight ) ) {
			//IE 4 compatible
			width = DOM.body.clientWidth;
			height = DOM.body.clientHeight;
		}
		
		return {"width": width, "height": height}
	
	};
	
	/**
	 * Function:
	 * 获取页面偏移
	 *
	 * Returns:
	 * {"x": scrOfX, "y": scrOfY }
	 */
	var getPageOffset = function(){
		var scrOfX = 0, scrOfY = 0;
		if( typeof( global.pageYOffset ) == 'number' ) {
			//Netscape compliant
			scrOfY = global.pageYOffset;
			scrOfX = global.pageXOffset;
		} else if( DOM.body && ( DOM.body.scrollLeft || DOM.body.scrollTop ) ) {
			//DOM compliant
			scrOfY = DOM.body.scrollTop;
			scrOfX = DOM.body.scrollLeft;
		} else if( DOM.documentElement && ( DOM.documentElement.scrollLeft || DOM.documentElement.scrollTop ) ) {
			//IE6 standards compliant mode
			scrOfY = DOM.documentElement.scrollTop;
			scrOfX = DOM.documentElement.scrollLeft;
		}
		
		return {"x": scrOfX, "y": scrOfY };
	};
	
	/**
	 * Function:
	 * 获取指定Frame的文档对象
	 * 
     * Parameters:
     *  frame - {HTMLIframeElement}
	 * 
	 * Returns:
	 * document - {Document}
	 *
	 */
	var getFrameDocument = function(frame){
		return frame.document || frame.contentDocument || frame.contentWindow.document; 
	}
	

	var fns = {
		//"body"  : new Node(DOM.body),
		"isNode": isNode,
		"create": create,
		"remove": remove,
		"addStyle": addStyle,
		"getWindowWH": getWindowWH,
		"getPageOffset": getPageOffset,
		"getFrameDocument" : getFrameDocument 
	};
	
	//EXPOSE
	return Base.mix(Dom,fns);
	
});
