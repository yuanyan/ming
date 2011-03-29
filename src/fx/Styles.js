// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * @name fx.Styles
 * @class
 */
module("fx.Styles", function(global){
	//IMPORT
	var Base = module("fx.Base"),
		langBase = module("lang.Base");
	
	/**
	 * 
	 * @param {Element} el 
	 * @param {Object} options
	 * @example
	 * 
	 * var fx= new Fx.Styles(el,options);
	 * fx.custom({
	 * 	 offsetHeight:[el.offsetHeight,0],
	 *   offsetWidth:[el.offsetWidth,0]
	 * });
	 */
    var Styles = function(el, options){
        this.initialize(el, options);
    };
	
    Styles.prototype = langBase.mix({
    
        "initialize": function(el, options){
            this.element = el;
            this.setOptions(options);
            this.now = {};
        },
        
		/**
		 * 设置当前的属性值
		 */
        "setNow": function(){
            for (p in this.from) {
				this.now[p] = this.compute(this.from[p], this.to[p]);
			}
        },
        
        "custom": function(obj){
            if (this.timer && this.options.wait) 
                return;
            var from = {};
            var to = {};
            for (p in obj) {
                from[p] = obj[p][0];
                to[p] = obj[p][1];
            }
            return this._start(from, to);
        },
        
        "increase": function(){
            for (var p in this.now) {
				this.setStyle(this.element, p, this.now[p]);
			}
        }
        
    }, Base);
	
	//EXPOSE
	return Styles;
    
});
