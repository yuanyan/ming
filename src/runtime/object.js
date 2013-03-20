!(function (factory) {
    if (typeof define === 'function') {
        define(['$', '../class/class', '../eventemitter/eventemitter'], factory);
    } else {
        factory($, $.Class, $.EventEmitter);
    }
})(function ($, Class, EventEmitter) {
    'use strict';

    var pluginName = 'Object';
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    var definePropertySupport = Object.defineProperty && Object.defineProperties;

    return $[pluginName] = Class.create(EventEmitter, {

        /**
         * object clone
         * @param deep If true, the merge becomes recursive (aka. deep copy).
         * @returns {{}}
         */
        clone : function( deep ){
            // http://api.jquery.com/jQuery.extend/
            var target = {};
            $.extend(deep, target, this);
            return target
        },

        /**
         * Watches a property of <obj> and runs <fn> when it changes.
         * @param prop
         * @param fn
         * @return {*}
         * @example
         *
         *   Object.watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         *   Object.extended().watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         */
        watch : function (prop, fn) {
            if (!definePropertySupport) return;
            if (!this._watchers) this._watchers = {};
            if (!this._watchers[prop]) this._watchers[prop] = [fn];
            else return this._watchers[prop].push(fn);

            var self =this, value = self[prop] ;
            Object.defineProperty(self, prop, {
                'enumerable': true,
                'configurable': true,
                'get': function () {
                    return value;
                },
                'set': function (to) {
                    if(!self._watchers || !self._watchers[prop]) return value = to;
                    $.each(self._watchers[prop], function(i, watcher){
                        value = watcher.call(self, prop, value, to) || to;
                    });
                }
            });
        },

        /**
         *
         * @param prop
         * @param fn
         */
        unwatch : function(prop, fn){
            if (!definePropertySupport || !this._watchers) return;
            // if no param give
            if(!prop && !fn) this._watchers = null;
            // if only give prop
            else if(prop && !fn) this._watchers[prop] = null;
            // if give all prop and fn
            else {
                var watchers = this._watchers[prop];
                $.each(watchers, function(i, watcher){
                    if(watcher == fn) watchers[prop].splice(i, 1)
                })
            }


        }

    });

});