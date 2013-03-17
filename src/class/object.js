!(function (factory) {
    if (typeof define === 'function') {
        define(['$', './class'], factory);
    } else {
        factory($);
    }
})(function ($, Class) {
    'use strict';

    var pluginName = 'Object';
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    var definePropertySupport = Object.defineProperty && Object.defineProperties;

    return $[pluginName] = Class.create({
        /***
         * @method watch(<obj>, <prop>, <fn>)
         * @returns Nothing
         * @short Watches a property of <obj> and runs <fn> when it changes.
         * @extra <fn> is passed three arguments: the property <prop>, the old value, and the new value. The return value of [fn] will be set as the new value. This method is useful for things such as validating or cleaning the value when it is set. Warning: this method WILL NOT work in browsers that don't support %Object.defineProperty%. This notably includes IE 8 and below, and Opera. This is the only method in Sugar that is not fully compatible with all browsers. %watch% is available as an instance method on extended objects.
         * @example
         *
         *   Object.watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         *   Object.extended().watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         *
         ***/
        'watch': function (prop, fn) {
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
                    $.each(self._watchers[prop])(function(i, watcher){
                        value = watcher.call(self, prop, value, to) || to;
                    });
                }
            });
        },

        'unwatch': function(prop, fn){
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