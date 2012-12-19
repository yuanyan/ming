!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    var LEFT = /^\s+/;
    var RIGHT = /\s+$/;

    var StringProto = String.prototype;
    var nativeTrim = StringProto.trim;
    var nativeTrimRight = StringProto.trimRight;
    var nativeTrimLeft = StringProto.trimLeft;

    var trim = {
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
        }
    };

    $.extend($, trim);
    return trim;
})