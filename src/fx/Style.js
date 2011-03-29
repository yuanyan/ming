// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * @name fx.Style
 * @class
 */
module("fx.Style", function(global){
	
	//IMPORT
	var Base = module("fx.Base"),
		langBase = module("lang.Base");
	/**
	 * 
	 * @param {Element} el
	 * @param {String} property
	 * @param {Object} options {optinal}
	 */
    var Style = function(el, property, options){
        this.initialize(el, property, options);
        
    };
    
    Style.prototype = langBase.mix({
    	
        "initialize": function(el, property, options){
            this.element = el;
            this.setOptions(options);
            this.property = property;  // property.camelize()
        },
        
        "increase": function(){
            this.setStyle(this.element, this.property, this.now);
        }
        
    }, Base);
	
	//EXPOSE
    return Style;
});
