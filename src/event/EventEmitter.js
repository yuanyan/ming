// Some of the functionality inspired by Prototype
// Copyright Joyent, Inc. and other Node contributors.
// Copyright Yuanyan <yuanyan.cao@gmail.com>.
// 2011/9/12

module("event.EventEmitter", function(global){

    var isArray = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    function EventEmitter() {
    }

    // By default EventEmitters will print a warning if more than
    // 10 listeners are added to it. This is a useful default which
    // helps finding memory leaks.
    //
    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    var defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
        if (!this._events) this._events = {};
        this._events.maxListeners = n;
    };


    EventEmitter.prototype.emit = function() {

        var type = arguments[0];

        // If there is no 'error' event listener then throw.
        if (type === 'error') {
            if (!this._events || !this._events.error ||
                (isArray(this._events.error) && !this._events.error.length)) {
                if (arguments[1] instanceof Error) {
                    throw arguments[1]; // Unhandled 'error' event
                } else {
                    throw new Error("Uncaught, unspecified 'error' event.");
                }
                return false;
            }
        }

        if (!this._events) return false;
        var handler = this._events[type];
        if (!handler) return false;

        var args = [].slice.call(arguments, 1, arguments.length);
        var listener, allArgs;

        if (typeof handler == 'function') {

            // listener._emmiters['onload'] = [true, [0,1], [error , data, ...]]
            // listener._emmiters['onrender'] = [true, [0], [error , data, ...]]
            // listener._emmiters['_conditions'] = [['onload','onrender'...],['onrun','onload',...]
            listener = handler;
            listener._emmiters[type][0] = true;
            listener._emmiters[type][2] = args;

            conditionCheckAndExe(listener, type);

            return true;


        } else if (isArray(handler)) {

            // clone array, avoid splice the array will leads error
            var handler2 = handler.slice(0);

            for (var i = 0, l = handler.length; i < l; i++) {

                listener = handler2[i];
                listener._emmiters[type][0] = true;
                listener._emmiters[type][2] = args;

                conditionCheckAndExe(listener, type);

            }

            return true;

        } else {
            return false;
        }
    };

    function conditionCheckAndExe(listener, type) {
        // listener._emmiters['onload'] = [true, [0,1], [error , data, ...]]
        // listener._emmiters['onrender'] = [true, [0], [error , data, ...]]
        // listener._emmiters['_conditions'] = [['onload','onrender'...],['onrun','onload',...]

        var conditions = listener._emmiters['_conditions'] ,
            indexes = listener._emmiters[type][1],
            condition, counter = 0;


        for (var i = 0, len = indexes.length; i < len; i++) {
            condition = conditions[indexes[i]];

            for (var j = 0, peeding = condition.length; j < peeding; j++) {
                type = condition[j];

                if (listener._emmiters[type][0]) {
                    counter++;

                    if (counter === peeding) {
                        var allArgs = [];
                        // apply the listener with current condition arguments
                        for (var k = 0; k < peeding; k++) {
                            type = condition[k];
                            allArgs = allArgs.concat(listener._emmiters[type][2]);
                        }

                        listener.apply(this, allArgs);
                        counter = 0;
                        break;
                    }
                } else {
                    break;
                }
            }

        }


    }

    // EventEmitter is defined in src/node_events.cc
    // EventEmitter.prototype.emit() is also defined there.
    EventEmitter.prototype.addListener = function(/*type, type, type,..., listener*/) {
        var args = arguments,
            pos = args.length - 1,
            type = "",
            _condition = null,
            _events = null,
            found = false,
            listener = args[pos];

        if ('function' !== typeof listener) {
            throw new Error('addListener only takes instances of Function');
        }

        if (!this._events) this._events = {};

        for (var i = pos - 1; i >= 0; i--) {

            type = args[i];

            // To avoid recursion in the case that type == "newListeners"! Before
            // adding it to the listeners, first emit "newListeners".
            this.emit('newListener', type, listener);
            _events = this._events[type];

            if (!_events) {
                // Optimize the case of one listener. Don't need the extra array object.
                this._events[type] = listener;

            } else if (isArray(_events)) {

                // Scan array whether listener already in it
                for (var j = 0, len = _events.length; j < len; j++) {
                    if (_events[j] === listener) {
                        found = true;
                        break;
                    }
                }

                // If not find in list, append it
                if (!found) _events.push(listener);

                // Check for listener leak
                if (!_events.warned) {
                    var m;
                    if (this._events.maxListeners !== undefined) {
                        m = this._events.maxListeners;
                    } else {
                        m = defaultMaxListeners;
                    }

                    if (m && m > 0 && _events.length > m) {
                        this._events[type].warned = true;
                        console && console.error && console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            this._events[type].length);

                        console && console.trace && console.trace();
                    }
                }
            } else if (_events !== listener) {
                // Adding the second element, need to change to array.
                this._events[type] = [_events, listener];
            }

            // listener._emmiters['onload'] = [true, [0,1], [error , data, ...]]
            // listener._emmiters['onrender'] = [true, [0], [error , data, ...]]
            // listener._emmiters['_conditions'] = [['onload','onrender'...],['onrun','onload',...]
            if (!listener._emmiters) {
                listener._emmiters = {'_conditions':[]};
            }

            if (!_condition) {
                var index = listener._emmiters['_conditions'].push([]) - 1;
                _condition = listener._emmiters['_conditions'][index];
            }
            // add type to current condition list
            _condition[i] = type;

            // add condition index to current type
            if (!listener._emmiters[type]) {
                listener._emmiters[type] = [false,[index]]; // is be emitted
            } else {
                listener._emmiters[type][1].push(index);
            }


        }


        return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    // Adds a one time listener for the event.
    // This listener is invoked only the next time the event is fired, after which it is removed.
    EventEmitter.prototype.once = function(/*type, type, type,..., listener*/) {
        var args = arguments,
            pos = args.length - 1,
            listener = args[pos];

        if ('function' !== typeof listener) {
            throw new Error('.once only takes instances of Function');
        }

        var self = this;

        function g() {
            self.removeListener.apply(self, args);
            listener.apply(this, arguments);
        }

        ;

        g.listener = listener;

        // replace the listener
        args = [].slice.call(args);
        args[pos] = g;

        self.on.apply(self, args);

        return this;
    };

    // Remove a listener from the listener array for the specified event.
    // Caution: changes array indices in the listener array behind the listener.
    EventEmitter.prototype.removeListener = function(/*type, type, type,..., listener*/) {
        var args = arguments,
            pos = args.length - 1,
            type = "",
            list,
            listener = args[pos];

        if ('function' !== typeof listener) {
            throw new Error('removeListener only takes instances of Function');
        }

        // does not use listeners(), so no side effect of creating _events[type]
        if (!this._events) return this;

        for (var i = pos - 1; i >= 0; i--) {
            type = args[i];
            list = this._events[type];

            if (isArray(list)) {
                var position = -1;
                for (var j = 0, len = list.length; j < len; j++) {
                    if (list[j] === listener ||
                        (list[j].listener && list[j].listener === listener)) {
                        position = j;
                        break;
                    }
                }

                if (position < 0) return this;
                list.splice(position, 1);

                if (list.length == 0)
                    delete this._events[type];
            } else if (list === listener ||
                (list.listener && list.listener === listener)) {
                delete this._events[type];
            }
        }

        return this;
    };

    EventEmitter.prototype.removeAllListeners = function(type) {
        if (arguments.length === 0) {
            this._events = {};
            return this;
        }

        // does not use listeners(), so no side effect of creating _events[type]
        if (type && this._events && this._events[type]) this._events[type] = null;
        return this;
    };

    // Returns an array of listeners for the specified event. This array can be manipulated, e.g. to remove listeners.
    EventEmitter.prototype.listeners = function(type) {
        if (!type) return this._events;
        if (!this._events) this._events = {};
        if (!this._events[type]) this._events[type] = [];
        if (!isArray(this._events[type])) {
            this._events[type] = [this._events[type]];
        }
        return this._events[type];
    };


	
	return EventEmitter;

}); 