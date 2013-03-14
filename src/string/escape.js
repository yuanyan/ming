!(function (factory) {
    if (typeof define === 'function') {
        define(['$', '../object/keys'], factory);
    } else {
        factory($);
    }
})(function ($, keys) {
    'use strict';

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

    var escape = {
        /**
         * Functions for escaping strings to HTML interpolation.
         * @param string
         * @returns {string}
         */
        escapeHTML : function(string) {
            if (string == null) return '';
            return ('' + string).replace(entityEscapeRegExp, function(match) {
                return entityEscapeMap[match];
            });
        },

        /**
         * Escape strings that are going to be used in a regex.
         * Escapes punctuation that would be incorrect in a regex.
         * @param s
         * @returns {string}
         */
        escapeRegExp : function(s) {
            return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
        }
    };

    $.extend($, escape);
    return escape;
})
