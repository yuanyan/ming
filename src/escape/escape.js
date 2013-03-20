!(function (factory) {
    if (typeof define === 'function') {
        define(['$', '../object/keys'], factory);
    } else {
        factory($, $.keys);
    }
})(function ($, keys) {
    'use strict';

    var pluginName = 'escape';

    // List of HTML entities for escaping.
    var entityEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    // Regexes containing the keys and values listed immediately above.
    var entityEscapeRegExp =   new RegExp('[' + keys(entityEscapeMap).join('') + ']', 'g');

    return $[pluginName] = {
        /**
         * Functions for escaping strings to HTML interpolation.
         * @param str
         * @returns {string}
         */
        escapeHTML : function(str) {
            if (str == null) return '';
            return String(str).replace(entityEscapeRegExp, function(match) {
                return entityEscapeMap[match];
            });
        },

        /**
         * Escape strings that are going to be used in a regex.
         * Escapes punctuation that would be incorrect in a regex.
         * @param str
         * @returns {string}
         */
        escapeRegExp : function(str) {
            if (str == null) return '';
            return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
        }
    };

})
