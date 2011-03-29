/**
 * @name NodeList
 * @class
 */
module("dom.NodeList",function(global){
	
	//IMPORT
	var $AP= Array.prototype, 
		Base = module("lang.Base"),
		Node=module("dom.Node");
	
	/**
	 * NodeList constructor
	 * @constructs
	 * @param {Object} domNode
	 */
	function NodeList(domNodes){	
		this.length=0;
		this.add(domNodes);		
	}

	
	NodeList.prototype =
	{
		/**
		 * 返回指定索引的节点
		 * @param {Number} index
		 */
		item:function(index){
			if (index === undefined) { //item() 返回第一个元素
				return this[0]||null;
			}else{
				return this[index]||null;
			}	
		},
		/**
		 * 遍历节点
		 * @param {Object} callback
		 */
		each:function(callback){	
			Base.each(this,callback);	
		},
		/**
		 * 获取第一个Node
		 */			
		first:function(){
			return this.item(0);	
		},
		/**
		 * 获取最后一个Node
		 */	
		last: function(){	
			return this.item(this.length-1);
		},
		
		/**
		 * 添加Node
		 * @param {Array} domNodes
		 * @param {Bollean} beginning 是否添加至NodeList开头位置，默认为否 
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
		 * append elements to an NodeList
		 * @param {Object} node ...
		 * 
		 */
		push: function(){		
			return this.add(arguments);
		},
		
		/**
		 * insert elements at the beginning of an NodeList
		 * @param {Object} node ...
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
	var NodeFns=['on', 'off', 'attr', 'removeAttr', 'html', 'text', 'val', 'hasClass', 'addClass', 'removeClass', 'toggleClass', 'empty', 'destroy', 'clone', 'css', 'show', 'hide', 'toggle'];
	
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
