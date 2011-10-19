/**
 * Class: Node
 */
module("dom.Node", function (global) {
	
	//IMPORT
	var Base = module("lang.Base"),
		Event = module("event.Event");
	
    var isNodeName = function (elem, name) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
    };

    var rradiocheck = /^(?:radio|checkbox)$/i,
        rreturn = /\r/g,
        rbody = /^(?:body|html)$/i;


    /** 
     * Constructor: Node
     * 
     * Parameters:
     * 	domNode - {Object} 
     */ 
    function Node(domNode) {
		
		if(!domNode){
			return null;
		}
		
		if(!(this instanceof Node)){
			return new Node(domNode);
		}

        if (domNode.nodeType) { //构造参数为原生domNode时		
            this[0] = domNode;
        } else { //构造参数为封装Node时
            this[0] = domNode[0];
        }

    }
	
    Node.prototype = 
	{
        /*----- 事件方法 -----*/
        //Group: Event
        /**
         * Function: on
         * 添加事件
         * 
         * Parameters:
         *  type - {Object}
         *  handler - {Object}
         * 
         * Returns: 
		 *	{Node} return self
         */
        "on": function (type, handler) {
            Event.on(this[0], type, handler);
            return this;
        },

        /**
         * Function: off
         * 移除事件
         * 
         * Parameters:
         * 	type - {Object}
         *  handler - {Object}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "off": function (type, handler) {
            Event.off(this[0], type, handler);
            return this;
        },
		
        /*----- 属性方法 -----*/
        //Group: Attribute
        /**
         * Function: attr
         * 设置元素的属性值
         * 
         * Parameters:
         *  name - {String} 属性名
         *  value - {String} 属性值
         * 
         * Returns: 
		 * 	{Node} return self
         * 
         * Example:
         * (code)
         *   node.attr("key","test");//设置属性值 
         * (end)
         */
        "attr": function (name, value) {

            if (name === undefined) return this;

            if (value === undefined) { //获取属性值
                return this[0].getAttribute(name)||"";
            } else { //设置属性值 
                this[0].setAttribute(name, value);
            }

            return this;

        },

        /**
         * Function: removeAttr
         * 删除指定的节点属性名
         * 
         * Parameters:
         * 	name - {String}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "removeAttr": function (name) {

            if (this[0].hasAttribute(name)) {
                this[0].removeAttribute(name);
            }

            return this;

        },

        //----- 内容方法 -----
        //Group: Content
		
        /**
         * Function: html
         * 设置元素的html内容。
         * 
         * Parameters:
         *  html - {String}
         *  
         * Returns: 
		 * 	{Node}
         */
        "html": function (html) {
            var elem = this[0];
            //getter
            if (value === undefined) {
                return elem && (elem.innerHTML || null); //TODO HTML Entries 转换         
            }
            // setter
            else {
                elem.innerHTML = html;
            }

            return this;


        },

        /**
         * Function: text
         * 设置元素内容的文本
         * 
         * Parameters:
         *  text - {String|Number}
         * 
         * Returns: 
		 * 	{String|Node}
         */
        "text": function (text) {

            var elem = this[0];

            //getter
            if (text === undefined) {
                if (elem.nodeType === 1) { // 检查是否为 elem_NODE(1)
                    return elem.textContent || "";
                } else if (elem.nodeType === 3) { // 检查是否为TEXT_NODE(3);
                    return elem.nodeValue;
                }
            }
            // setter
            else {

                if (elem.nodeType === 1) { // 检查是否为 elem_NODE(1)
                    elem.textContent = text;
                } else if (elem.nodeType === 3) { // 检查是否为TEXT_NODE(3);
                    elem.nodeValue = text;
                }

            }

            return this;

        },

        /*-----值方法-----*/
		//Group: Value
		
        /**
         * Function: val
         * 设置元素的值 value, 通常用于表单元素
         * 
         * Parameters:
         *  value - {String|Number|Array}
         * 
         * Returns: 
		 * 	{String|Node}
         */
        "val": function (value) {

            var elem = this[0];
            //getter
            if (value === undefined) {

                if (elem) {

                    // 当没有设定 value 时，标准浏览器 option.value === option.text
                    // ie7- 下，没有设定 value 时，option.value === '', 需要用 el.attributes.value 来判断是否有设定 value
                    if (isNodeName(elem, "option")) {
                        // attributes.value is undefined in Blackberry 4.7 but
                        // uses .value. See #6932
                        var val = elem.attributes.value;
                        return !val || val.specified ? elem.value : elem.text;
                    }

                    // We need to handle select boxes special
                    if (isNodeName(elem, "select")) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type === "select-one";

                        // Nothing was selected
                        if (index < 0) {
                            return null;
                        }

                        // Loop through all the selected options
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];

                            // Don't return options that are disabled or in a disabled optgroup
                            if (option.selected && (!option.parentNode.disabled || !isNodeName(option.parentNode, "optgroup"))) {

                                // Get the specific value for the option
                                value = this.val();

                                // We don't need an array for one selects
                                if (one) {
                                    return value;
                                }

                                // Multi-Selects return an array
                                values.push(value);
                            }
                        }

                        return values;
                    }

                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    if (Base.isWebkit && rradiocheck.test(elem.type)) {
                        return elem.getAttribute("value") === null ? "on" : elem.value;
                    }


                    // Everything else, we just grab the value
                    return (elem.value || "").replace(rreturn, "");

                }

                return undefined;

            } else { //setter
                if (elem.nodeType !== 1) { // 检查是否为 elem_NODE(1)
                    return;
                }

                var val = value;

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") { // 强制转换数值为字符串
                    val += "";
                } else if (Base.isArray(val)) {
                    val = val.map(function (value) {
                        return value == null ? "" : value + "";
                    });
                }


                if (Base.isArray(val) && rradiocheck.test(elem.type)) { //radio 与 checkbox 元素 设值
                    elem.checked = this.val().indexOf(val) >= 0;

                } else if (isNodeName(elem, "select")) { //select元素设值
                    var opts = elem.options,
                        opt;

                    for (var i = 0, len = opts.length; i < len; ++i) {
                        opt = opts[i];
                        opt.selected = (this.val(opt), vals);
                    }

                    var values = Base.toArray(val);

                    values.forEach(function (val) {
                        elem.selected = this.val().indexOf(val) >= 0;
                    });

                    if (!values.length) {
                        this.selectedIndex = -1;
                    }

                } else { //其他表单元素设值
                    elem.value = val;
                }

            }

            return this;


        },


        /*-----样式方法-----*/
		//Group: Style
		
		/**
         * Function: css
         * 设置节点样式
         * 
         * Parameters:
         *  cssText - {String} 样式
         *  
         */
		"css": function(cssText){
			this[0].style.cssText = cssText;
		},
		
        /**
         * Function: style
         * 设置节点样式值
         * 
         * Parameters:
         *  name - {String|Object}
         *  value - {String}
         *  
         * Returns: 
		 * 	{String} return self
         */
        "style": function (name, value) {
            //properties
            if (Base.isObject(name)) {
                for (var k in name) {
                    this.style(k, name[k]);
                }
                return this;
            }

            var elem = this[0];
            //getter
            if (value === undefined) {
                var ret;
                if (elem && elem.style) {
                    ret = elem.style[name];
                }

                return ret === undefined ? '' : ret;

            }
            //setter
            else {
                //部分样式浏览器兼容性处理
				if(name === "opacity"){				
					elem.style["opacity"] = value; // CSS3
					elem.style["filter"] = 'alpha(opacity=' + (value * 100) + ')'; // IE 6/7/8
					
				}else if(name === "whiteSpace" && value === "pre-wrap"){
					elem.style[name] = value;  // CSS3
					elem.style[name] = "pre";   // IE 6/7
					elem.style["wordWrap"] = "break-word"; // IE 6/7
					
                }else {
					elem.style[name] = value || "";
				}
				
            }

            return this;

        },
		
        /**
         * Function: hasClass
         * 元素是否含有指定的类名
         * 
         * Parameters:
         *  clazz - {Object}
         * 
         * Returns: 
		 * 	{Boolean}
         */
        "hasClass": function (clazz) {
            var flag = false;
            this.attr("class").split(" ").forEach(function (val) {
                if (val == clazz) flag = true;
            });

            return flag;

        },
		
        /**
         * Function: addClass
         * 元素添加指定的类名
         * 
         * Parameters:
         *  clazz - {String}
         *  
         * Returns: 
		 * 	{Node} return self
         */
        "addClass": function (clazz) {

            this.attr("class", (this.attr("class") || "") + " " + clazz); //无论之前是否有指定当前类名，都在最后添加
            return this;
        },
		
        /**
         * Function: removeClass
         * 元素中删除全部或者指定的类
         * 
         * Parameters:
         *  clazz - {String}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "removeClass": function (clazz) {
            if (clazz === undefined) { //removeClass() 删除全部类
                this.removeAttr("class");
            } else {
                var newClazzs = [];
                this.attr("class").split(" ").forEach(function (val) {
                    if (val != clazz && val != "") newClazzs.push(val);
                });

                this.removeClass();
                this.addClass(newClazzs.join(" "));
            }
            return this;
        },

        /**
         * Function: toggleClass
         * 如果存在（不存在）就删除（添加）一个类
         * 
         * Parameters:
         *  clazz - {String}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "toggleClass": function (clazz) {
            if (this.hasClass(clazz)) {
                this.removeClass(clazz);
            } else {
                this.addClass(clazz);
            }

            return this;

        },

        /*-----文档结构检索方法-----*/
		//Group: Traversal
        /**
         * Function: next
         * 获取后一个兄弟节点
         * 
         * Returns: 
		 * 	{?Node} nextNode
         */
        "next": function () {
            return new Node(this[0].nextSibling);
        },

        /**
         * Function: prev
         * 获取前一个兄弟节点
         * 
         * Returns: 
		 * 	{?Node} previousNode
         */
        "prev": function () {
            return new Node(this[0].previousSibling);
        },

        /**
         * Function: parent
         * 获取父节点
         * 
         * Returns: 
		 * 	{?Node} parentNode 父节点
         */
        "parent": function () {
            return new Node(this[0].parentNode);
        },

        /**
         * Function: childrens
         * 获取所有子节点，或满足条件的子节点
         * 
         * Parameters:
         *  match - {Function}
         * 
         * Returns: 
		 * 	{Array} nodes 
         */
        "childrens": function (match) {
            //TODO 满足条件的子节点
            var nodes = [];
            this[0].childNodes.forEach(function (domNode) {
                nodes.push(new Node(domNode));
            });
            return nodes;
        },

		/**
		 * Function: walk
		 * 遍历节点
		 * 
		 * Parameters:
		 *  callback - {function(Node):boolean} 回调函数返回true时（考虑大部分情况下回调函数没有返回值为false时，通常为遍历所有），遍历结束
		 *  opt_node - {Node=} 
		 */
		"walk" : function(callback, opt_node){
			
			var node = opt_node||this[0];
			
	        if (!fn(node)) {
				//what to do at this node
				node = node.firstChild;
				while (node) {
					this.walk(callback, node); //递归调用
					node = node.nextSibling;
				}
			}
			
		},
		
        /*-----节点基础方法-----*/
		//Group: Life
        /**
         * Function: empty
         * 清空当前节点的所有子节点，或满足条件的子节点
         * 
         * Parameters:
         *   match - {Function}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "empty": function (match) {
            this.childrens(match).forEach(function (node) {
                node.destory();
            });
            return this;
        },

        /**
         * Function: destroy
         * 销毁当前节点
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "destroy": function () {

            this[0].parentNode.removeChild(this[0]);
            return this;
        },

        /**
         * Function: clone
         * 节点克隆
         * 
         * Parameters:
         *  deep - {boolean}默认false 
         * 
         * Returns: 
		 * 	{Node} return cloneNode 
         */
        "clone": function (deep) {
            return new Node(this[0].cloneNode(deep || false));
        },

        /*-----文档结构内部插入方法-----*/
		//Group: Insertion
        /**
         * Function: append
         * 向当前子节点尾部添加节点
         * 
         * Parameters:
         * - {Object} node 支持原生的domNode和封装Node
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "append": function (node) {
            if (!node.nodeType) { //参数为封装Node时，还原到原生的domNode
                node = node[0];
            }
            this[0].appendChild(node);
            return this;

        },


        /**
         * Function: prepend
         * 向当前子节点首部添加节点
         * 
         * Parameters:
         * - {Object} node 支持原生的domNode和封装Node
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "prepend": function (node) {
            if (!node.nodeType) { //参数为封装Node时，还原到原生的domNode
                node = node[0];
            }
            if (node.hasChildNodes()) { //当前有子节点时
                this.childrens()[0][0].insertBefore(node);
            } else {
                this[0].appendChild(node)
            }
            return this;

        },


        /**
         * Function: appendTo
         * 当前节点追加到另一个指定的节点内尾部
         * 
         * Parameters:
         *   node - {Object} 支持原生的domNode和封装Node
         *   
         * Returns: 
		 * 	{Node} return self
         */
        "appendTo": function (node) {
            new Node(node).append(this[0]);
            return this;
        },

        /**
         * Function: prependTo
         * 当前节点追加到另一个指定的节点内首部
         * 
         * Parameters:
         *   node - {Object} 支持原生的domNode和封装Node
         *   
         * Returns: 
		 * 	{Node} return self
         */
        "prependTo": function (node) {
            new Node(node).prepend(this[0]);
            return this;
        },

        /*-----文档结构外部插入方法-----*/

        /**
         * Function: before
         * 当前节点前插入节点
         * 
         * Parameters:
         *   node - {Object}支持原生的domNode和封装Node
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "before": function (node) {
            if (!node.nodeType) { //参数为封装Node时，还原到原生的domNode
                node = node[0];
            }
            this[0].insertBefore(node);
            return this;
        },

        /**
         * Function: after
         * 当前节点后插入节点
         * 
         * Parameters:
         *   node - {Object} 支持原生的domNode和封装Node
         *   
         * Returns: 
		 * 	{Node} return self
         */
        "after": function (node) {
            //当前为最后一个节点时
            if (this[0] == this[0].parentNode.lastChild) {
                this.append(node);
            } else {
                this.next().before(node);
            }
            return this;
        },

        /*-----尺度方法-----*/
		//Group: Dimensions
        /**
         * Function: height
         * 设置节点高度
         * 
         * Parameters:
         * 	value - {Number}
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "height": function (value) {
            //getter
            if (value === undefined) {
                return getWH(this, "height");

            }
            //setter
            else {

                this.style("height", value);

            }

            return this;

        },
        /**
         * Function: width
         * 设置节点宽度
         * 
         * Parameters:
         *  value - {Number}
         *  
         * Returns: 
		 * 	{Node} return self
         */
        "width": function (value) {

            //getter
            if (value === undefined) {
                return getWH(this, "width");

            }
            //setter
            else {

                this.style("width", value);

            }

            return this;

        },


        /*-----位置方法-----*/
		//Group: Position
        /**
         * Function: offset
         * 设置相对 page 的偏移
         * 
         * Parameters:
         *  obj - {Object}
         * 
         * Returns: 
		 * 	{Object} obj {left:10,top:10}
         */
        "offset": function (obj) {

            //getter
            if (obj === undefined) {
                var elem = this[0];

                if (typeof(elem.offsetParent) != 'undefined') {
                    var origElem = elem;
                    for (var posX = 0, posY = 0; elem; elem = elem.offsetParent) {
                        posX += elem.offsetLeft;
                        posY += elem.offsetTop;
                    }
                    if (!origElem.parentNode || !origElem.style || typeof(origElem.scrollTop) == 'undefined') {
                        return {
                            left: posX,
                            top: posY
                        };
                    }
                    elem = getOffsetParent(origElem);
                    while (elem && elem != document.body && elem != document.documentelem) {
                        posX -= elem.scrollLeft;
                        posY -= elem.scrollTop;
                        elem = getOffsetParent(elem);
                    }
                    return {
                        left: posX,
                        top: posY
                    };
                } else {
                    return {
                        left: elem.x,
                        top: elem.y
                    };
                }
            }
            //setter
            else {
                this.setOffset(obj);
            }

            return this;


        },

        /**
         * 设置offset
         * @private 
         * @param {Object} obj
         * @return {Node} return self
         */
        "setOffset": function (obj) {

            var elem = this[0];
            var position = getComputedStyle(elem, 'position');

            // set position first, in-case top/left are set even on static elem
            if (position === 'static') {
                elem.style['position'] = 'relative';
            }
            var origOffset = this.offset(),
                styles = {},
                current, key;

            for (key in obj) {
                current = parseInt(this.style(key), 10) || 0;
                styles[key] = current + obj[key] - origOffset[key];
            }
            this.style(styles);

        },

        /**
         * Function: position
         * 设置相对父元素的偏移
         * 
         * Returns: 
		 * 	{Object} obj {left:10,top:10}
         */
        "position": function () {

            var elem = this[0],

            // Get *real* offsetParent
			offsetParent = new Node(getOffsetParent(elem)),

            // Get correct offsets
            offset = this.offset(),
                parentOffset = isBody(offsetParent) ? {
                top: 0,
                left: 0
            } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(this.style("marginTop")) || 0;
            offset.left -= parseFloat(this.style("marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(offsetParent.style("borderTopWidth")) || 0;
            parentOffset.left += parseFloat(offsetParent.style("borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };

        },

        /**
         * Function: scroll
         * 设置相对滚动条的偏移
         * 
         * Returns: 
		 * 	{Object} obj {left:10,top:10}
         */
        "scroll": function () {
            var elem = this[0];
            if (isBody(elem)) {
                return {
                    left: document.body.scrollLeft,
                    top: document.body.scrollTop
                }
            }
            return {
                left: elem.scrollLeft,
                top: elem.scrollTop
            };
        },


        /*-----未支持动画的显示方法-----*/
		//Group: Display
        /**
         * Function: show
         * 显示节点
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "show": function () {
            return this.style("display","none");
        },
		
        /**
         * Function: hide
         * 隐藏节点
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "hide": function () {
			return this.style("display","");
        },
		
        /**
         * Function: toggle 
         * 显示/隐藏状态切换
         * 
         * Returns: 
		 * 	{Node} return self
         */
        "toggle": function () {
			if(this.style("display")){
				this.show();	
			}else{	
				this.hide();
			}
			
			return this;
        },
		
		/*----- 检索内容与节点方法 -----*/
		//Group: Content Retrieval
		/**
		 * Function: contains
		 * 是否包含指定文本
		 * 
		 * Parameters:
		 * 	text - {String}
		 * 
		 * Returns: 
		 * 	{Boolean} return boolean
		 */
		"contains" :function(text){
			
			var flag= false;
			
			this.walk(function(node){
				var nodeText = new Node(node).text();
				return flag = ( nodeText.indexOf(text) >= 0 );
			});

			return flag;
		}
		

    };

    /**
     * 是否为body或html元素
     * @private 
     * @param {Object} elem
     */
    var isBody = function (elem) {
        return rbody.test(elem.tagName);
    };

    /**
     * 
     * 获取一个元素计算后的样式（即该元素的默认样式、HTML 属性、样式表规则和行内样式影响后的最终计算样式）
     * @private 
     * @param {Object} elem
     * @param {Object} name
     */
    var getComputedStyle = function (elem, name) {
        var val = '';
        if (elem.currentStyle) { //只有 IE6 IE7 IE8 Opera 支持使用 currentStyle 获取 HTMLelem 的计算后的样式   see: http://www.w3help.org/zh-cn/causes/BT9008	
            val = elem.currentStyle[name];
        } else { //getComputedStyle 是 W3C 建议的方式，目前，Firefox Chrome Safari Opera 均实现了这一方法
            val = elem.ownerDocument.defaultView.getComputedStyle(elem, null)[name];
        }
        return val;
    };

    /**
     * 获取当前计算偏移元素的祖先
     * @private
     * @param {Object} elem
     */
    var getOffsetParent = function (elem) {

        var position = getComputedStyle(elem, 'position');

        var offsetParent = this.offsetParent || document.body;
        while (offsetParent && (!isBody(offsetParent) && position === "static")) { //static 
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent;

    };

    /**
     * 获取元素高度或宽度
     * @private 
     * @param {Object} elem
     * @param {Object} name 
     */
    var getWH = function (elem, name) {

        var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'],
        val = name === 'width' ? elem.offsetWidth : elem.offsetHeight;

        Base.each(which, function (direction) {
            val -= parseFloat(getComputedStyle(elem, 'padding' + direction)) || 0;
            val -= parseFloat(getComputedStyle(elem, 'border' + direction + 'Width')) || 0;
        });

        return val;
    };

	/**
	 * offset升级方法
	 * @private
	 * @param {Object} obj
	 */
    //IE的getBoundingClientRect方法，我们得以用更简单更快捷更安全的方法来定位页面元素。getBoundingClientRect返回的是一个集合，分别为元素在浏览器可视区的四个角的坐标。
    if ("getBoundingClientRect" in document.documentElement) {
        Node.prototype.offset = function (obj) {
            //getter
            if (obj === undefined) {
                var elem = this[0],
                    box;

                if (!elem || !elem.ownerDocument) {
                    return null;
                }

                if (isBody(elem)) {
                    return bodyOffset(elem);
                }

                try {
                    box = elem.getBoundingClientRect();
                }
                catch(e) {}

                var doc = elem.ownerDocument,
                    docElem = doc.documentElement;

                // Make sure we're not dealing with a disconnected DOM node
                /*
	            if (!box || !Base.dom.contains(elem)) {
	                return box ||
	                {
	                    top: 0,
	                    left: 0
	                };
	            }
	            */

                var body = doc.body,
                    win = doc.defaultView,
                    clientTop = docElem.clientTop || body.clientTop || 0,
                    clientLeft = docElem.clientLeft || body.clientLeft || 0,
                    scrollTop = (win.pageYOffset && docElem.scrollTop || body.scrollTop),
                    scrollLeft = (win.pageXOffset && docElem.scrollLeft || body.scrollLeft),
                    top = box.top + scrollTop - clientTop,
                    left = box.left + scrollLeft - clientLeft;

                return {
                    top: top,
                    left: left
                };

            }
            //setter
            else {
                this.setOffset(obj);

            }
        };

    }

    // EXPOSE
    return Node;

});