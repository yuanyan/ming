!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'observer';

    // Object.observe -> dirty-checking
    // http://wiki.ecmascript.org/doku.php?id=harmony:observe
    var objectObserveSupport = typeof Object.observe == 'function';


})