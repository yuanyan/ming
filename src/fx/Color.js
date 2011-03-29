// moo.fx.js version 2.0 
//(c) 2006 Valerio Proietti (http://mad4milk.net). MIT-style license.
/**
 * @name fx.Color
 * @class
 */
module("fx.Color", function(){
	
	//IMPORT
	var Base = module("fx.Base"),
		langBase = module("lang.Base"),
		utilColor = module("util.Color");
	
    var Color = function(el, options){
        this.initialize(el, options);
    };
    
    Color.prototype = langBase.mix({
    
        "initialize": function(el, property, options){
            this.element = el;
            this.setOptions(options);
            this.property = property.camelize();
            this.now = [];
        },
        
        "custom": function(from, to){
            return this._start(utilColor.hexToRgb(from,true), utilColor.hexToRgb(to,true));
        },
        
        "setNow": function(){
            [0, 1, 2].each(function(i){
                this.now[i] = Math.round(this.compute(this.from[i], this.to[i]));
            }.bind(this));
        },
        
        "increase": function(){
            this.element.style[this.property] = "rgb(" + this.now[0] + "," + this.now[1] + "," + this.now[2] + ")";
        }
        
    }, Base);
	
	//EXPOSE
	return Color;
    
});


/**
 * TODO:
 * 
 * 修改hexToRgb调用方式
 * bind方法
 * 
 */