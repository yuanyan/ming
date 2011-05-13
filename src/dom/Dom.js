/**
 * Class: Dom
 */
module("dom.Dom",function(global){
	
	//IMPORT
	var Node = module("dom.Node"),
		Base = module("lang.Base"),
		query = module("dom.query");
	
	var DOM=document,Dom=new Node(document);
	
	
	
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

	var fns = {
		"isNode": isNode,
		"create": create,
		"remove": remove,
		"addStyle": addStyle
	};
	
	//EXPOSE
	return Base.mix(Dom,fns);
	
});
