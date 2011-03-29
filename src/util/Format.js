/**
 * @name util.Format
 * @class
 */
module("util.Format", function(global){
	
	/**
	 * 把Css属性名格式化为骆驼型
	 * @param {String} str
	 * @return {String} camelize
	 * @example 
	 *  var before= "font-size";
	 *  var after= camelize(before); //"fontSize"
	 */
	var camelize = function(str){
		return str.replace(/-\D/gi, function(match){
			return match.charAt(match.length - 1).toUpperCase();
		});
	};	
	
	
	/**
	 * 以模板方式格式化文本
	 * @example
	 * format("{1},{2}",1,2) === 1,2
	 * format("{1},{1}",1)  === 1,1
	 * 
	 * @param {String} temp
	 * @param {String|Number|Boolean} value1 The value to replace token {1}
	 * @param {String|Number|Boolean} value2 Etc...
	 * @return {String}
	 */
	var format = function(temp){
		
		var args = Array.prototype.slice.call(arguments, 1 );
	
        return temp.replace(/\{(\d+)\}/g, function(m, i){
			if (args[i-1]) {
				return args[i-1];
			}
			else { 
				return "";
			}			
        });
    };

	
	return {
		"camelize" : camelize,
		"format" : format
	};
		
});

