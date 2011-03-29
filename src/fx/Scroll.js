// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * @name fx.Scroll
 * @class
 */
module("fx.Scroll", function(global){
	
	//IMPORT
	var Base = module("fx.Base"),
		langBase = module("lang.Base");	//IMPORT

	
    var Scroll = function(el, options){
        this.initialize(el, options);
    };
    
    Scroll.prototype = langBase.mix({
    
        "initialize": function(el, options){
            this.element = el;
            this.setOptions(options);
            this.element.style.overflow = 'hidden';
        },
        
        "down": function(){
            return this.custom(this.element.scrollTop, this.element.scrollHeight - this.element.offsetHeight);
        },
        
        "up": function(){
            return this.custom(this.element.scrollTop, 0);
        },
        
        "increase": function(){
            this.element.scrollTop = this.now;
        }
        
    }, Base);
	
	//EXPOSE
	return Scroll;
    
});
