!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    var format = {

        /**
         * Convert bytes into KB or MB
         * @param bytes
         * @returns {string}
         */
        bytesToMB : function(bytes) {
            var byteSize = Math.round(bytes / 1024 * 100) * 0.01;
            var suffix = 'KB';
            if (byteSize > 1000) {
                byteSize = Math.round(byteSize * 0.001 * 100) * 0.01;
                suffix = 'MB';
            }
            var sizeParts = byteSize.toString().split('.');
            byteSize = sizeParts[0] + (sizeParts.length > 1 ? '.' + sizeParts[1].substr(0,1) : '');
            return byteSize + ' ' + suffix;
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
        }

    };

    $.extend($, format);
    return format;
})