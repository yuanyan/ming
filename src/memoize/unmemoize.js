!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'unmemoize';


    return $[pluginName] = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };


});