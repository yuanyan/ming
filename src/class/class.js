!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'Class';

    function Class(proto){

        if (!(this instanceof Class)) {
            return new Class(proto);
        }

        proto = proto || {};

        var parent = proto.extend;

        var clazz = function(){
            if (parent)
                new parent();

            var value = (proto.constructor && (typeof this.constructor === "function")) ? this.constructor.apply(this, arguments) : this;
            return value;
        };

        if (parent) {
            clazz.extend(parent);
        }

        clazz.prototype = proto;

        clazz.extend = function(parent, override){

            if (typeof parent === "function") {
                parent = parent.prototype;
            }

            var proto = clazz.prototype;

            for (var i in parent) {

                if (!proto.hasOwnProperty(i)) {
                    proto[i] = parent[i];
                }
                else {
                    !override || (proto[i] = parent[i]);
                }
            }

            return clazz; // return self
        };

    }


    return $[pluginName] = Class;
})