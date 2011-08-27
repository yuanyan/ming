/**
 * Class: NodeList
 */
module("dom.NodeList",function(global){
	
	//IMPORT
	var $AP= Array.prototype, 
		Base = module("lang.Base"),
		Node=module("dom.Node");
	
    /** 
     * Constructor: NodeList
     * 
     * Parameters:
     * 	domNode - {Object} 
     */ 	
	function NodeList(domNodes){
		//var: length
		this.length=0;
		this.add(domNodes);		
	}

	
	NodeList.prototype =
	{
		/**
		 * Function: item
		 * 返回指定索引的节点
		 * 
		 * Parameters:
		 *  index - {Number}
		 *  
		 * Returns:
		 * 	{Node}
		 */
		item:function(index){
			if (index === undefined) { //item() 返回第一个元素
				return this[0]||null;
			}else{
				return this[index]||null;
			}	
		},
		
		/**
		 * Function: each
		 * 遍历节点
		 * 
		 * Parameters:
		 *  callback - {Function}
		 */
		each:function(callback){	
			Base.each(this, callback);	
		},
		/**
		 * Function: first
		 * 获取第一个Node
		 * 
		 * Returns: {Node}
		 */			
		first:function(){
			return this.item(0);	
		},
		/**
		 * Function: last
		 * 获取最后一个Node
		 * 
		 * Returns: 
		 * 	{Node}
		 */	
		last: function(){	
			return this.item(this.length-1);
		},
		
		/**
		 * Function: add
		 * 添加Node
		 * 
		 * Parameters:
		 *  domNodes - {Array[DOMNode|Node]}
		 *  beginning - {Bollean} 是否添加至NodeList开头位置，默认为否 
		 */
		add: function(domNodes, beginning){
			var nodes=[];
			Base.toArray(domNodes).forEach(function(domNode){
				nodes.push(new Node(domNode));	
			});
			
			if (beginning) {
				$AP.unshift.apply(this, nodes);
			}else {
				$AP.push.apply(this, nodes);
			}
			
			return this;		
		},
		
		/**
		 * Function: push
		 * 在NodeList尾部插入节点
		 * 
		 * Parameters:
		 *  node - {...DOMNode|Node}
		 * 
		 */
		push: function(){		
			return this.add(arguments);
		},
		
		/**
		 * Function: unshift
		 * 在NodeList头部插入节点
		 * 
		 * Parameters:
		 * 	node - {...DOMNode|Node}
		 */
		unshift: function(){
			return this.add(arguments,true)
		}
		
		
		
	};

		
	var $NP= NodeList.prototype;	
	
	//Array映射到NodeList的方法列表
	var ArrayFns=['concat', 'pop', 'reverse', 'shift', 'slice', 'splice','indexOf', 'lastIndexOf', 'remove', 'every', 'filter', 'map', 'some', 'reduce', 'reduceRight'];
	
	for(var i=0,l=ArrayFns.length; i<l; i++){
		var fn=ArrayFns[i];
		$NP[fn]=function(){
			var args=arguments;
			$AP[fn].apply(this, args);	
			return this;
		}
		
	}
		
	//Node映射到NodeList的方法列表
	var NodeFns=['on', 'off', 'attr', 'removeAttr', 'html', 'text', 'val', 'hasClass', 'addClass', 'removeClass', 'toggleClass', 'empty', 'destroy', 'clone', 'style', 'css', 'show', 'hide', 'toggle'];
	
	for(var i=0,l=NodeFns.length; i<l; i++){
		var fn=NodeFns[i];
		$NP[fn]=function(){	
			var args=arguments;
			this.each(function(node){
				node[fn].apply(null, args);
			});
			
			return this;
		}
		
	}
	 
	//EXPOSE
	return NodeList;
	
});
