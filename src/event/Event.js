/**
 * @name Event
 * @namespace
 * 事件机制封装
 * 对标准事件模型与IE事件模型间差异进行封装
 */
module("event.Event", function(global){
	
	//IMPORT
	var Selector = module("dom.Selector"),
		langBase = module("lang.Base");
	
	/**
	 * 事件仓库
	 * {guid1:{type1:[handler1,handler2],type2:[handler3,handler4]}}
	 * guid2:{type1:[handler5,handler6],type2:[handler7,handler8]}}
	 * }
	 */
	var repository={ },guid=1;
	/**
	 * 根据一个原生的事件对象,获取一个事件包装对象,主要是为了fix一些浏览器的差异
	 * @param {Object} target
	 * @param {Object} domEvent
	 * @param {String} type
	 */
    var fixEvent = function(target, domEvent, type){
		
		var returnFalse= function(){return false},
			returnTrue= function(){return true};
			
			
		var props= "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");
        /**
         * @class Event
         * @param {Object} target
         * @param {Object} domEvent
         */
        var Event = function(target, domEvent, type){
            this.originalEvent = domEvent;//原始event
            
            this.currentTarget = target;
        
            if (domEvent&&domEvent.type) { // HTML DOM 事件
                this.type = domEvent.type;
                this._fix(); 
            }
            else { // 自定义事件
                this.type = type;
                this.target = target;
            }
           
        };
        
        Event.prototype = {
			/**
			 * 是否阻止默认的事件动作发生
			 */
			isDefaultPrevented: returnFalse,
			/**
			 * 是否停止事件冒泡向上传递
			 */
			isPropagationStopped: returnFalse,
			/**
			 * 是否立即停止事件冒泡向上传递
			 */
			isImmediatePropagationStopped: returnFalse,
 
			/**
			 * 封装事件的preventDefault实现,阻止默认的事件动作发生
			 */
            preventDefault: function(){
                this.isDefaultPrevented = returnTrue;
                
                var e = this.originalEvent;
                if (!e) {
                    return;
                }
                
                // if preventDefault exists run it on the original event
                if (e.preventDefault) {
                    e.preventDefault();          
                }
				// otherwise set the returnValue property of the original event to false (IE)
                else {
                    e.returnValue = false;
                }
            },
			/**
			 * 封装事件的stopPropagation实现,停止事件冒泡向上传递
			 */
            stopPropagation: function(){
                this.isPropagationStopped = returnTrue;
                
                var e = this.originalEvent;
                if (!e) {
                    return;
                }
                // if stopPropagation exists run it on the original event
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                // otherwise set the cancelBubble property of the original event to true (IE)
                else {
					e.cancelBubble = true;
				}
            },
			/**
			 * Prevents any further propagation of an event.
			 */
			stopImmediatePropagation: function() {
				this.isImmediatePropagationStopped = returnTrue;
				
	            var e = this.originalEvent;
				if (!e) {
                    return;
                }
	            if (e.stopImmediatePropagation) {
	                e.stopImmediatePropagation();
	            } else {
	                this.stopPropagation();
	            }
	            
        	},
			
			_fix: function(event){
                var self = this, 
					originalEvent = this.originalEvent, 
					len = props.length, 
					prop, 
					ct = this.currentTarget, 
					ownerDoc = (ct.nodeType === 9) ? ct : (ct.ownerDocument || document); // support iframe
                // 复制原生事件对象属性至包装对象
                while (len) {
                    prop = props[--len];
                    self[prop] = originalEvent[prop];
                }
                
                // 修正target，IE中采用srcElement
                if (!self.target) {
                    self.target = self.srcElement || document; // srcElement might not be defined either
                }
                // 对于文本节点事件，应该把target设置为其父节点(safari) 
                if (self.target.nodeType === 3) {
                    self.target = self.target.parentNode;
                }
                
                // 修正relatedTarget，通常用于mouseout、mouseover
				// 在IE中分为toElement和fromElement两个Target变量，在mozilla中没有分开。为了保证兼容，统一采用relatedTarget
                if (!self.relatedTarget && self.fromElement) {
                    self.relatedTarget = (self.fromElement === self.target) ? self.toElement : self.fromElement;
                }

                // calculate pageX/Y if missing and clientX/Y available
                if (self.pageX === undefined && self.clientX !== undefined) {
                    var docEl = ownerDoc.documentElement, bd = ownerDoc.body;
                    self.pageX = self.clientX + (docEl && docEl.scrollLeft || bd && bd.scrollLeft || 0) - (docEl && docEl.clientLeft || bd && bd.clientLeft || 0);
                    self.pageY = self.clientY + (docEl && docEl.scrollTop || bd && bd.scrollTop || 0) - (docEl && docEl.clientTop || bd && bd.clientTop || 0);
                }
                
                // add which for key events
                if (!self.which) {
                    self.which = (self.charCode) ? self.charCode : self.keyCode;
                }
                
                // add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
                if (self.metaKey === undefined) {
                    self.metaKey = self.ctrlKey;
                }
                
                // add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!self.which && self.button !== undefined) {
                    self.which = (self.button & 1 ? 1 : (self.button & 2 ? 3 : (self.button & 4 ? 2 : 0)));
                }
            }

        };
        
        return new Event(target, domEvent, type);
    }
	
	var isElement = function(obj) {
        return obj && (obj.nodeType || obj.attachEvent || obj.addEventListener);
    };
	
	var getEventGuid= function(obj){
		return obj["_event_guid"]||(obj["_event_guid"] = guid++);
	};
	
	/**
	 * 
	 * @param {Object} obj
	 * @param {String} type
	 * @param {Function} handler
	 */
	var addListener= function(obj,type,handler){
		obj["on"+type]= addEventHandle(obj,type,handler);		
	};
	
	/**
	 * 
	 * @param {Object} obj
	 * @param {String} type
	 * @param {Function} handler
	 */
	var removeListener= function(obj,type,handler){
		removeEventHandle(obj,type,handler);
	};
	
	/**
	 * 触发事件
	 * @param {Object} obj
	 * @param {String} type
	 * @param {Object} event
	 */
	var fireEvent= function(obj,type,event){
		obj["on"+type](event);
	};
	
	/**
	 * 绑定只触发一次的事件
	 * @param {Object} obj
	 * @param {Object} type
	 * @param {Object} handler
	 */
	var one= function(obj,type,handler){
		var originalHandler=handler;
		handler=function(e){
			originalHandler(e);
			removeListener(obj,type,handler);	
		}
		addListener(obj,type,handler);	
	};
	
	/**
	 * 
	 * @param {String} selector 选择器
	 * @param {String} type 事件类型
	 * @param {Function} handler 事件处理
	 * @param {Object} context 
	 */
	var live= function(selector, type, handler, context){
		var originalHandler=handler,select = Selector.select;
		handler=function(e){
			var r=select(selector,context);
			for(var i=0,len=r.length;i<len;++i){
				if (e.target == r[i]) {
					originalHandler(e);
					break;
				}
			}		
		}
		addListener(document, type, handler);
	};
	
	/**
	 * 注册事件
	 * @param {Object} obj
	 * @param {Object} type
	 * @param {Object} handler
	 */
	var addEventHandle= function(obj,type,handler){
		//guid初始从1开始
		var id=getEventGuid(obj);
		var events=repository[id];
		if(events) {//当前对象已经有事件注册
			if(events[type]){//当前类型事件已经有注册
				events[type].push(handler);	
			}else{	//当前类型事件从未注册
				events[type]=[handler];	
			}
		}
		else {//当前对象从未有事件注册
			repository[id]={ };
			repository[id][type]=[handler];
		}
		
        return function(e){		
            e = fixEvent(obj, e); //事件兼容修正,包含自定义事件
			if (repository[id]) {
				var handlers = repository[id][type];
				if (handlers) {
					handlers.forEach(function(handler){
						handler(e);
					});
				}
			}
        }

	};
	
	/**
	 * 
	 * @param {Object} obj
	 * @param {Object} type
	 * @param {Object} handler
	 */
	var removeEventHandle= function(obj,type,handler){
		if(obj === undefined) return;
		var id=getEventGuid(obj);
		if(!id||!repository[id]){ //未注册过事件时直接返回
			return;	
		}
		
		if (handler !== undefined) { // obj type handler
			var handlers = repository[id][type];
			handlers.forEach(function(fn, i){
				if (fn == handler) {
					handlers.remove(i);
				}
			});
		}else if(type !== undefined){  //obj type
			var events = repository[id];
			if (events[type]) {
				delete events[type];
			}
			obj["on"+type]=null;
			
		}else{ // obj
			var events = repository[id];
			langBase.each(events,function(handlers,type){
				obj["on"+type]=null;
			});
			delete repository[id];	
		}
			
	};
	
	//EXPOSE
	return {
		"on": addListener,
		"off": removeListener,
		"fire": fireEvent,
		"one": one,
		"live": live
	}
    
}); // 



/**
 * 
 * 
    **
     * 获取当前鼠标位置的坐标
     * @param {Event} e
     * @return {Object}
     *
    var getPosition = function(e){
        var X = 0, Y = 0;
        var event = e || window.event;
        
        if (event.pageX) {
            X = event.pageX;
            Y = event.pageY;
        }
        else 
            if (event.clientX) {
                X = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
                Y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
            }    
        
        //封装成对象返回
        return {
            x: X,
            y: Y
        };
    };
	
**/
