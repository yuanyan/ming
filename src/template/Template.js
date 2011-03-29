module("template.Template", function(){

	/**
	 * 简单的模板机制
	 * @example
	 * template("${i},${j}",{i:11,j:22}) === 11,22
	 * @param {String} temp 模板
	 * @param {Object} val 模板对象
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

