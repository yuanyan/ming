/**
 * Class: Color
 */
module("util.Color",function(){
	
    var rRgb=new RegExp('([\\d]{1,3})', 'g');
	var rHex=new RegExp('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$');
	
	/**
	 * Function: rgbToHex
	 * RGB格式转化为HEX
	 * 
	 * Parameters:
	 *  rgb - {String}  
	 *  array - {Boolean} 以数组格式返回
	 *  
	 * Returns:
	 *	 {String} hexText #1e2fcc
	 */
    var rgbToHex = function(rgb,array){
        rgb = rgb.match(rRgb);
        if (rgb[3] == 0) 
            return 'transparent';
        var hex = [];
        for (var i = 0; i < 3; i++) {
            var bit = (rgb[i] - 0).toString(16);
            hex.push(bit.length == 1 ? '0' + bit : bit);
        }
        
        if (array) {
			return hex;
		}
		else {
			var hexText = '#' + hex.join('');
			return hexText;
		}
    };
    
	/**
	 * Function: hexToRgb
	 * HEX格式转化为RGB
	 * 
	 * Parameters:
	 *  hex - {String} 
	 *  array - {Boolean} 以数组格式返回
	 * 
	 * Returns:
	 *  {String|Array}
	 * 
	 * Example:
	 * (code)
	 * 	hexToRgb("#FFF",true) //[255,255,255]
	 * (end)
	 */
    var hexToRgb = function(hex,array){
        hex = hex.match(rHex);
        var rgb = [];
        for (var i = 1; i < hex.length; i++) {
            if (hex[i].length == 1) 
                hex[i] += hex[i];
            rgb.push(parseInt(hex[i], 16));
        }
        
        if (array) {
			return rgb;
		}
		else {
			var rgbText = 'rgb(' + rgb.join(',') + ')';
			return rgbText;
		}
    };
	
	//EXPOSE	
	return {	
		"hexToRgb":hexToRgb,
		"rgbToHex":rgbToHex
	};


});