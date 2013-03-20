!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'trim';

    var LEFT = /^\s+/;
    var RIGHT = /\s+$/;

    var StringProto = String.prototype;
    var nativeTrim = StringProto.trim;
    var nativeTrimRight = StringProto.trimRight;
    var nativeTrimLeft = StringProto.trimLeft;


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
    return $[pluginName] = function(type, str){
            if(type && str){
                if(type === 'left'){
                    if (nativeTrimLeft) return nativeTrimLeft.call(str);
                    return str.replace(LEFT, "");
                }else if(type === "right"){
                    if (nativeTrimRight) return nativeTrimRight.call(str);
                    return str.replace(RIGHT, "");
                }
            }else{
               str = type;
            }

            if (str == null) return '';
            if (nativeTrim) return nativeTrim.call(str);
            return str.replace(LEFT, "").replace(RIGHT, "");
        }

})