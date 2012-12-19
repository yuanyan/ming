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


        /**
         * Function: extend
         * 给类添加方法
         *
         * Parameters:
         *  parent - {Class|Object}
         *  override - {Boolean} 是否覆盖已有方法，默认是非覆盖式的
         *
         * Returns:
         *  返回类对象本身
         */
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

            return clazz; // 返回类对象本身
        };

    }


    return $[pluginName] = Class;
})