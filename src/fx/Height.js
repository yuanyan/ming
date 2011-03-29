// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * @name fx.Height
 * @class
 */
module("fx.Height", function(global){
	
	//IMPORT
	var Base = module("fx.Base"),
		langBase = module("lang.Base");
	
    var Height = function(el, options){
        this.initialize(el, options);
        
    };
    
    Height.prototype = langBase.mix({
    
        "initialize": function(el, options){
            this.element = el;
            this.setOptions(options);
            this.element.style.overflow = 'hidden';
        },
        
        "toggle": function(){
            if (this.element.offsetHeight > 0) 
                return this.custom(this.element.offsetHeight, 0);
            else 
                return this.custom(0, this.element.scrollHeight);
        },
        
        "show": function(){
            return this.set(this.element.scrollHeight);
        },
        
        "increase": function(){
            this.setStyle(this.element, 'height', this.now);
        }
        
    }, Base);
    
	//EXPOSE
	return Height;

});
