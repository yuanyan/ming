!(function (name, factory) {
    if (typeof define === 'function') {
        define(name, ['jquery'], factory);
    } else {
        var $ = this.jQuery || this.$;
        var ret = factory($);
        ret && ($[name] = ret);
    }
})('string', function ($) {

    var LEFT = /^\s+/;
    var RIGHT = /\s+$/;
    var RGB = /([\\d]{1,3})/g;
    var HEX = /^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$/;

    var StringProto = String.prototype;
    var nativeTrim = StringProto.trim;
    var nativeTrimRight = StringProto.trimRight;
    var nativeTrimLeft = StringProto.trimLeft;

    return {
        /**
         * Function: trim
         * ECMA-262-5 15.5.4.20
         * Trims whitespace from both ends of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String}
         */
        trim: function(str){
            if (str == null) return '';
            if (nativeTrim) return nativeTrim.call(str);
            return str.replace(LEFT, "").replace(RIGHT, "");
        },
        /**
         * Function: trimLeft
         * Trims whitespace from the left side of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *   {String}
         */
        trimLeft: function(str){
            if (str == null) return '';
            if (nativeTrimLeft) return nativeTrimLeft.call(str);
            return str.replace(LEFT, "");
        },

        /**
         * Function: trimRight
         * Trims whitespace from the right side of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String}
         */
        trimRight : function(str){
            if (str == null) return '';
            if (nativeTrimRight) return nativeTrimRight.call(str);
            return str.replace(RIGHT, "");
        },

        /**
         * Function: camelize
         * 把Css属性名格式化为骆驼型
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String} camelize
         *
         * Example:
         *  var before= "font-size";
         *  var after= camelize(before); //"fontSize"
         */
        camelize : function(str){
            return str.replace(/-\D/gi, function(match){
                return match.charAt(match.length - 1).toUpperCase();
            });
        },

        /**
         * Function: format
         * 以模板方式格式化文本
         *
         * Parameters:
         *  temp - {String}
         *  value1 - {String|Number|Boolean} The value to replace token {1}
         *  value2 - {String|Number|Boolean} Etc...
         *
         * Returns:
         *   {String}
         *
         * Example:
         * (code)
         * format("{1},{2}",1,2) === 1,2
         * format("{1},{1}",1)  === 1,1
         * (end)
         */
        format : function(temp){

            var args = Array.prototype.slice.call(arguments, 1 );

            return temp.replace(/\{(\d+)\}/g, function(m, i){
                if (args[i-1]) {
                    return args[i-1];
                }
                else {
                    return "";
                }
            });
        },



        /**
         * Function: rgbToHex
         * RGB格式转化为HEX
         *
         * Parameters:
         *  rgb - {String}
         *  array - {Boolean} 以数组格式返回
         *
         * Returns:
         *   {String} hexText #1e2fcc
         */
         rgbToHex : function(rgb, array){
            rgb = rgb.match(RGB);
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
         },

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
         *    hexToRgb("#FFF",true) //[255,255,255]
         * (end)
         */
         hexToRgb : function(hex, array){
            hex = hex.match(HEX);
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
         }

    }
})