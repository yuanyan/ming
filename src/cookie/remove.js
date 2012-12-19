!(function (factory) {
    if (typeof define === 'function') {
        define(['$', './cookie'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    return $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };
})

