!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    var pluginName = 'format';

    return $[pluginName] = {

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
         * Converts underscored or dasherized string to a camelized one
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
            return String(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c.toUpperCase(); });
        },

        /**
         * Function: format
         * Simple String Formatting
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
         * print("{1},{2}",1,2) === 1,2
         * print("{1},{1}",1)  === 1,1
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

})