!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'keys';

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    var keys = Object.keys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (obj.hasOwnProperty(key)) keys[keys.length] = key;
        return keys;
    };

    $[pluginName] = keys;
})