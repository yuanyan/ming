/**
 * Class: Flash
 *
 */
module("util.Flash", function(global){

	/**
	 * Function: getFlashVersion 
	 * 获取Flash版本号
	 * 
	 * Returns:
	 * {Array|undefined} [10,2,152,32]
	 */
	function getFlashVersion(){
		var flashVersion;
		if(window.ActiveXObject){
			try{
				// IE返回"WIN 10,2,152,32"格式
				flashVersion=(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
			}catch(e){}
		}
		else if(navigator.plugins && navigator.plugins["Shockwave Flash"]){
			// NPAPI插件架构浏览器返回"Shockwave Flash 10.3 r181"格式
			flashVersion = (navigator.plugins["Shockwave Flash"]||0).description;
		}
		
		if(flashVersion){
			/**
			 * 格式化版本号
			 * @param {String}
			 * @return {Array}
			 */
			function format(str){
				return str.match(/(\d)+/g);
			}
			
			flashVersion = format(flashVersion);
		}
		
		return flashVersion;
	
	}
	


});