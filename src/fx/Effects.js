/**
 * @name fx.Effects
 * @class
 * 动画效果 
 * blind 
 * bounce 
 * clip 
 * drop 
 * explode
 * fade 淡入淡出
 * fold 
 * highlight 高亮
 * pulsate 
 * scale 
 * shake 
 * slide 幻灯片
 * transfer
 */
module("fx.Effects", function(global){


	/**
	 * @param {Object} options (object, optional) An object with options for the effect. See below.
	 * 
	 * fps - (number: defaults to 50) The frames per second for the transition.
	 * unit - (string: defaults to false) The unit, e.g. 'px', 'em', or '%'. See Element:setStyle.
	 * transition - (function: defaults to 'sine:in:out' The equation to use for the effect see Fx.Transitions. Also accepts a string in the following form:
	 * transition[:in][:out] - for example, 'linear', 'quad:in', 'back:in', 'bounce:out', 'elastic:out', 'sine:in:out'
	 * Events:
	 *	start - (function) The function to execute when the effect begins.
	 *	cancel - (function) The function to execute when you manually stop the effect.
	 *	complete - (function) The function to execute after the effect has processed.
	 *	chainComplete - (function) The function to execute when using link 'chain' (see options). It gets called after all effects in the chain have completed.
	 * Notes:
	 *	You cannot change the transition if you haven't included Fx.Transitions.js, (unless you plan on developing your own curve). ;)
	 *	The Fx Class is just a skeleton for other Classes to extend the basic functionality.
	 */
	
		
	//IMPORT

	
	
});
