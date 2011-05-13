/**
 * Class: Template
 */
module("template.Template", function(){

	/**
	 * Function: template
	 * 简单的模板机制
	 * 
	 * Parameters:
	 * 	temp - {String} 模板
	 * 	val - {Object} 模板对象
	 * 
	 * Returns: 
	 * 	{String}
	 * 
	 * Example:
	 * (code)
	 * template("${i},${j}",{i:11,j:22}) === 11,22
	 * (end)
	 */
	var template = function(temp, val){
	
		return temp.replace(/\$\{(\w+)\}/g, function(m, i){
			if (val[i]) {
				return val[i];
			}
			else { //模板对象未定义时
				return "";
			}
		});
		
	};
	
	return {
		"template": template	
	};
		

});

