!(function (factory) {
    if (typeof define === 'function') {
        define(['$', './cookie'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    return $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };
})

