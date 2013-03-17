!(function (factory) {
    if (typeof define === 'function') {
        define(['$', './class'], factory);
    } else {
        factory($);
    }
})(function ($, Class) {
    'use strict';
    var pluginName = 'Object';
    var Object =  Class.create();
    return $[pluginName] = Object;
});