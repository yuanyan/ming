/**
 * class-based OOP
 * 1.把类抽象为Class类类型
 * 2.以混入mix的机制实现类方法继承，故无法用 instanceof 来判断是否为父类的实例
 * 3.支持对象生命周期中constructor的定义
 * 4.只支持在Class类描述中定义单继承，多继承可以通过Class.extend静态方法扩展类
 * 
 * @param {Object} proto
 * @example
 * var Animal= new Class({
 * 	constructor:function(){console.log("Animal");},
 *  eat:function(){console.log("eat");}	
 * });
 * 
 * var Bird = new Class({
 *  extend: Animal,
 *  constructor:function(){console.log("Bird");},
 *  fly:function(){console.log("fly");}
 *  
 * });
 * 
 * var bird=new Bird();
 * bird.eat();
 */

module("lang.Class",function(){
	
    function Class(proto){
	
		if (!this instanceof Class) {
			return new Class(proto);
		}
		
		proto = proto || {};
		
		var parent = proto.extend;
		
		var clazz = function(){
			if (parent) 
				new parent();
			
			var value = (proto.constructor && (typeof this.constructor === "function")) ? this.constructor.apply(this, arguments) : this;
			return value;
		};
		
		if (parent) {
			clazz.extend(parent);
		}
		
		clazz.prototype = proto;
		
		
		/**
	 * 给类添加方法
	 * @param {Class|Object} mehtods
	 * @override {Boolean} override 是否覆盖已有方法，默认是非覆盖式的
	 */
		clazz.extend = function(parent, override){
		
			if (typeof parent === "function") {
				parent = parent.prototype;
			}
			
			var proto = clazz.prototype;
			
			for (var i in parent) {
			
				if (!proto.hasOwnProperty(i)) {
					proto[i] = json[i];
				}
				else {
					!override || (proto[i] = parent[i]);
				}
			}
			
			return clazz; // 返回类对象本身
		};
		
	}
	
	
	//EXPOSE
	return Class;
			
	
});
