//Class: Selector
//轻量选择器
//
//支持选择器:
//1.简单选择器
// - #id
// - .class
// - tag
// - tag.class
// - tag#id
// - *
//
//2.子元素选择器
//
//3.组合选择器
//
//注意:
//-  不支持 #id.class
//-  尽可能使用子元素选择器(parent>child)而非组合选择器(parent child)
//-  不支持含有通配符 * 的组合选择器
//-  其他选择器可通过filter(elem,index,nodes)回调函数间接实现
//
//参考:
// - http://ejohn.org/blog/selectors-that-people-actually-use/
// - http://ejohn.org/blog/thoughts-on-queryselectorall/
// - http://github.com/jeresig/sizzle
// - http://james.padolsey.com/javascript/mini/

module("dom.Selector", function(global){
	
	//IMPORT
	var Base = module("lang.Base");

    var DOM = document,
        na = [null, null],
        quickId = /^#[\w-]+$/,
        rId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
        rTag = /^([\w\*\-_]+)/,
        rClass = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
        rQuery = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/g; // #id tag .class
        
	var _toArray = Base.toArray;

    var _filter = function (arr, callback, thisArg) {
        if (Array.prototype.filter) {
            return arr.filter(callback, thisArg);
        } else {
            var len = arr.length,
                result = [];
            for (var i = 0; i < len; ++i) {
                var current = arr[i];
                if (current !== undefined || i in arr) {
                    callback.call(thisArg, current, i, arr) && result.push(arr[i]);
                }
            }

            return result;

        }
    };
	
	/**
	 * Function: select
	 * 节点查询
	 * 
	 * Parameters:
	 *  query - {String}  查询表达式
	 *  context - {Object} 查询上下文
	 *  filter - {Function} 过滤规则
	 *  
	 * Returns: 
	 *	{Array[DOMNode]}
	 */
    var select = function (query, context, filter) {
        if (!context) context = DOM; // 默认上下文为整个DOM  
        //FIX:修正 context===undefined 判断为 !context 或  context = context || DOM , 允许 select("#id",null)
        if (query === undefined) select("*", context); //select() == select("*",document) 返回所有DOM节点
        var ret = [],
            query = query.trim();


        // 通常#id选择器的使用频率最高，单独处理  see:http://ejohn.org/blog/selectors-that-people-actually-use/
        if (quickId.test(query)) { //#id
            var el = getElementById(query.slice(1), context);
            ret = el ? [el] : [];
        } else {
            // 获取匹配出的信息
            var parts = query.match(rQuery),
                part = parts.pop(),
                id = (part.match(rId) || na)[1],
                tag = (part.match(rTag) || na)[1],
                cls = !id && (part.match(rClass) || na)[1]; // 不支持 #id.class,但支持#id .class
            if (cls) { //tag.class  .clsss 
                ret = _toArray(getElementsByClass(cls, tag, context));
            } else if (tag) {

                ret = _toArray(getElementsByTag(tag, context)); //tag
                if (id) { //tag#id 
                    ret = _filter(ret, function (elem) {
                        return elem.id == id;
                    });
                }

            } else if (id) { //#id #id
                var el = getElementById(id, context);
                ret = el ? [el] : [];
            }

            ret = parts[0] && ret[0] ? filterParents(parts, ret, context) : ret;
        }


        if (filter && ret[0]) { //当查找结构不为并且设置了过滤规则时
            ret = _filter(ret, filter);
        }

        return ret;
    }

    /* #id */
    var getElementById = function (id, context) {
        var el = DOM.getElementById(id),
            flag = false;
        if (el && (context || DOM) != DOM) {
            var p = el.parentNode;
            while (p) {
                if (p == context) {
                    flag = true;
                    break;
                }
                p = p.parentNode;
            }
        } else {
            flag = true;
        }

        return flag ? el : null;
    };

    //NOTE：未修正 IE下getElementByID除了判断元素的ID，还有Name值的情形

    /* tag */
    var getElementsByTag= function (tag, context) {

        return context.getElementsByTagName(tag);

    };

    //getElementsByTagName('*') 兼容性检查与修正
    (function () {
        // 避免 getElementsByTagName('*') 可能会返回COMMENT NODE 
        // 创建一个测试元素
        var test = DOM.createElement('div');
        test.appendChild(DOM.createComment(''));

        // 在当前环境下查询getElementsByTagName('*')时 COMMENT NODE会被添加时，方法中检查NODE类型以过滤COMMENT NODE
        if (test.getElementsByTagName("*").length > 0) {
            getElementsByTag = function (tag, context) {
                var ret = context.getElementsByTagName(tag);

                if (tag == "*") {
                    var t = [],
                        i = 0,
                        j = 0,
                        node;
                    while (node = ret[i++]) {
                        // 过滤其他非元素类型节点
                        if (node.nodeType === 1) {
                            t[j++] = node;
                        }
                    }
                    ret = t;
                }
                return ret;
            };
        }

        test = null; 
    })();

    /* .class */
    var getElementsByClass = function (cls, tag, context) {
        var els = context.getElementsByClassName(cls),
            ret = els;

        if (tag && tag != "*") {
            var i = 0,
                j = 0,
                len = els.length,
                el;
            ret = [];
            tag = tag.toUpperCase();
            for (; i < len; ++i) {
                el = els[i];
                if (el.tagName === tag) {
                    ret[j++] = el;
                }
            }
        }
        return ret;
    }
	
    //getElementsByClassName 兼容性检查与修正
	//IE9之前版本不支持getElementsByClassName
    if (!DOM.getElementsByClassName) { 
        // IE 8 下使用 querySelectorAll
        if (DOM.querySelectorAll) {
            getElementsByClass = function (cls, tag, context) {
                return context.querySelectorAll((tag ? tag : '') + '.' + cls);
            }
        } else {
            // IE6 IE7 下降级到普通方法 
            getElementsByClass = function (cls, tag, context) {
                var els = context.getElementsByTagName(tag || "*"),
                    ret = [],
                    i = 0,
                    j = 0,
                    len = els.length;
                for (; i < len; ++i) {
                    var el = els[i];
                    if (RegExp('(^|\\s)' + cls + '(\\s|$)').test(el.className)) {
                        ret[j++] = el;
                    }
                }
                return ret;
            }
        }

    }


    function filterParents(parts, nodes, context, direct) {

        var selector = parts.pop();

        if (selector === '>') {
            return filterParents(parts, nodes, context, true);
        }

        var ret = [],
            m = -1,
            i = -1,
            id = (selector.match(rId) || na)[1],
            tag = (selector.match(rTag) || na)[1],
            cls = !id && (selector.match(rClass) || na)[1], 
        	node, parent, match;

        tag = tag && tag.toUpperCase();

        while ((node = nodes[++i])) {
            p = node.parentNode;
            do {
                match = (!tag || tag === '*' || tag === p.nodeName) && (!id || p.id === id) && (!cls || RegExp('(^|\\s)' + cls + '(\\s|$)').test(p.className));
                if (direct || match || p == context) { // 为直接子节点选择器    或  已经匹配  或  抵达当前上下文节点 时
                    break;
                }
            } while ((p = p.parentNode));

            if (match) {
                ret[++m] = node;
            }
        }

        return parts[0] && ret[0] ? filterParents(parts, ret, context) : ret;

    }
 
    // 优先使用浏览器支持的querySelectorAll
	// 目前主流浏览器中 IE6\7  FF3.0 不支持querySelectorAll
    if (DOM.querySelectorAll) {
        (function () {
            var old = select,
                ret;

            select = function (query, context, filter) {
                context = context || DOM;

                //DOMElement.querySelectorAll returning incorrect elements,This is spec bug
                //see: http://ejohn.org/blog/thoughts-on-queryselectorall/
                if (context.nodeType === 9) {
                    ret = _toArray(context.querySelectorAll(query));
                    if (filter) {
                        ret = _filter(ret, filter);
                    }
                    return ret;
                } else {
                    return old(query, context, filter);
                }
            };

      
        })();
    }
	
	//EXPOSE
	return {
		"select": select
	};
	
});


