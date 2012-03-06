/**
 * Class: Touch
 * 触屏事件机制封装
 * copyright Touchy.js https://github.com/jairajs89/Touchy.js
 */


/*

 // The HTML element that to watch for touches
 var touchMe = document.getElementById('touch-me');

 Touch(touchMe, function (hand, finger) {
 // This function will be called for every finger that touches the screen
 // regardless of what other fingers are currently interacting.

 // 'finger' is an object representing the entire path of a finger
 // on the screen. So a touch-drag-release by a single finger would be
 // encapsulated into this single object.

 // 'hand' is an object holding all fingers currently interacting with the
 // screen.
 // 'hand.fingers' returns an Array of fingers currently on the screen
 // including this one.
 // In this case we are only listening to a single finger at a time.
 if (hand.fingers.length > 1) {
 return;
 }

 // This callback is fired when the finger initially touches the screen.
 finger.on('start', function (point) {
 // 'point' is a coordinate of the form { id: <string>, x: <number>, y: <number>, time: <date> }
 });

 // This callback is fired when finger moves.
 finger.on('move', function (point) {
 console.log('finger is moving');
 });

 // This callback is fired when finger is released from the screen.
 finger.on('end', function (point) {
 // 'finger.points' holds the entire path that the finger moved through.
 finger.points.forEach(function (point) {
 console.log('time:', point.time);
 console.log('left:', point.x   );
 console.log(' top:', point.y   );
 });
 });
 });

 Multi-touch example
 var touchMe = document.getElementById('touch-me');

 Touch(touchMe, {
 one: function (hand, finger) {
 // Full touchy style event system, run only when exactly one finger
 // on screen.

 // In these cases 'hand' is only alive for the duration of touches that
 // have the exact number of simulataneous touches (unlike in the
 // previous example).
 },

 two: function (hand, finger1, finger2) {
 // Only run when exactly two fingers on screen
 hand.on('move', function (points) {
 // 'points' is an Array of point objects (same as finger.on point object)
 });
 }

 // 'three', 'four', 'five' are supported as well.
 // 'any' is the same as the previous example.
 });
 */

define("event.Touch", function(require, exports, module){

    var event = require("event.Event"),
        bind = event.on,
        unbind = event.off,
        array = require("lang.Array"),
        forEach = array.forEach,
        indexOf = array.indexOf,
        map = array.map,
        filter = array.filter;



    /* Object to manage a single-finger interactions */
    function Finger (id) {
        this.id        = id;
        this.points    = [];
        this.callbacks = {
            'start': [],
            'move' : [],
            'end'  : []
        };
    }

    /* Bind event listeners to finger movements */
    Finger.prototype.on = function (name, callback) {
        this.callbacks[name].push(callback);
    };

    /* Trigger finger movement event */
    Finger.prototype.trigger = function (name, point) {
        var that = this;

        forEach(this.callbacks[name], function (callback) {
            callback.call(that, point);
        });
    };



    /* Object to manage multiple-finger interactions */
    function Hand (ids) {
        this.fingers = !ids ? [] : map(ids, function (id) {
            return new Finger(id);
        });

        this.callbacks = {
            'start': [],
            'move' : [],
            'end'  : []
        };
    }

    /* Add an active finger to the hand */
    Hand.prototype.add = function (finger) {
        var index = indexOf(this.fingers, finger);

        if (index == -1) {
            this.fingers.push(finger);
        }
    };

    /* Remove an inactive finger from the hand */
    Hand.prototype.remove = function (finger) {
        var index = indexOf(this.fingers, finger);

        if (index != -1) {
            this.fingers.splice(index, 1);
        }
    };

    /* Get finger by id */
    Hand.prototype.get = function (id) {
        var foundFinger;

        forEach(this.fingers, function (finger) {
            if (finger.id == id) {
                foundFinger = finger;
            }
        });

        return foundFinger;
    };

    /* Bind event listeners to finger movements */
    Hand.prototype.on = function (name, callback) {
        this.callbacks[name].push(callback);
    };

    /* Trigger finger movement event */
    Hand.prototype.trigger = function (name, points) {
        var that = this;

        forEach(this.callbacks[name], function (callback) {
            callback.call(that, points);
        });
    };



    /* Convert DOM touch event object to simple dictionary style object */
    function domTouchToObj (touches, time) {
        return map(touches, function (touch) {
            return {
                id: touch.identifier,
                x: touch.pageX,
                y: touch.pageY,
                time: time
            };
        });
    }


    /* Socket-style finger management for multi-touch events */
    function Touch (elem, settings) {
        if (typeof settings == 'function') {
            settings = { any: settings };
        }

        var mainHand = new Hand(),
            multiHand,
            count = 0;

        bind(elem, 'touchstart', touchstart);
        bind(elem, 'touchmove' , touchmove );
        bind(elem, 'touchend'  , touchend  );

        function touchstart (e) {
            var touches = domTouchToObj(e.touches, e.timeStamp),
                changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

            mainHandStart(changedTouches);
            multiHandStart(changedTouches, touches);
        }

        function touchmove (e) {
            var touches = domTouchToObj(e.touches, e.timeStamp),
                changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

            mainHandMove(changedTouches);
            multiHandMove(changedTouches, touches);
        }

        function touchend (e) {
            var touches = domTouchToObj(e.touches, e.timeStamp),
                changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

            mainHandEnd(changedTouches);
            multiHandEnd(changedTouches, touches);
        }

        /* Handle the start of an individual finger interaction */
        function mainHandStart (changedTouches) {
            var newFingers = [];

            forEach(changedTouches, function (touch) {
                var finger = new Finger(touch.id);
                finger.points.push(touch);
                newFingers.push([finger, touch]);
                mainHand.add(finger);
            });

            forEach(newFingers, function (data) {
                settings.any && settings.any(mainHand, data[0]);
                data[0].trigger('start', data[1]);
            });

            mainHand.trigger('start', changedTouches);
        }

        /* Handle the movement of an individual finger interaction */
        function mainHandMove (changedTouches) {
            var movedFingers = [];

            forEach(changedTouches, function (touch) {
                var finger = mainHand.get(touch.id);
                finger.points.push(touch);
                movedFingers.push([finger, touch]);
            });

            forEach(movedFingers, function (data) {
                data[0].trigger('move', data[1]);
            });

            mainHand.trigger('move', changedTouches);
        }

        /* Handle the end of an individual finger interaction */
        function mainHandEnd (changedTouches) {
            var endFingers = [];

            forEach(changedTouches, function (touch) {
                var finger = mainHand.get(touch.id);
                finger.points.push(touch);
                endFingers.push([finger, touch]);
                mainHand.remove(finger);
            });

            forEach(endFingers, function (data) {
                data[0].trigger('end', data[1]);
            });

            mainHand.trigger('end', changedTouches);
        }

        /* Handle the start of a multi-touch interaction */
        function multiHandStart (changedTouches, touches) {
            multiHandDestroy();
            multiHandRestart(touches);
        }

        /* Handle the movement of a multi-touch interaction */
        function multiHandMove (changedTouches, touches) {
            var movedFingers = [];

            forEach(changedTouches, function (touch) {
                var finger = multiHand.get(touch.id);
                finger.points.push(touch);
                movedFingers.push([finger, touch]);
            });

            forEach(movedFingers, function (data) {
                data[0].trigger('move', data[1]);
            });

            multiHand.trigger('move', changedTouches);
        }

        /* Handle the end of a multi-touch interaction */
        function multiHandEnd (changedTouches, touches) {
            multiHandDestroy();

            var remainingTouches = filter(touches, function (touch) {
                var unChanged = true;

                forEach(changedTouches, function (changedTouch) {
                    if (changedTouch.id == touch.id) {
                        unChanged = false;
                    }
                });

                return unChanged;
            });

            multiHandRestart(remainingTouches);
        }

        /* Create a new hand based on the current touches on the screen */
        function multiHandRestart (touches) {
            if (touches.length == 0) {
                return;
            }

            multiHand = new Hand();
            var newFingers = [];

            forEach(touches, function (touch) {
                var finger = new Finger(touch.id);
                finger.points.push(touch);
                newFingers.push([finger, touch]);
                multiHand.add(finger);
            });

            var func = settings[ {
                1: 'one',
                2: 'two',
                3: 'three',
                4: 'four',
                5: 'five'
            }[ multiHand.fingers.length ] ];

            func && func.apply(window, [multiHand].concat(multiHand.fingers));

            forEach(newFingers, function (data) {
                data[0].trigger('start', data[1]);
            });

            multiHand.trigger('start', touches);
        }

        /* Destroy the current hand regardless of fingers on the screen */
        function multiHandDestroy () {
            if ( !multiHand ) {
                return;
            }

            var points = [];

            forEach(multiHand.fingers, function (finger) {
                var point = finger.points[ finger.points.length - 1 ];
                finger.points.push(point);
                points.push(point);
                finger.trigger('end', finger.point);
            });

            multiHand.trigger('end', points);

            multiHand = null;
        }
    };


    /* Prevent window movement (iOS fix) */
    var preventDefault = function (e) { e.preventDefault() };

    Touch.stopWindowBounce = function () {
        bind(window, 'touchmove', preventDefault);
    };

    Touch.startWindowBounce = function () {
        unbind(window, 'touchmove', preventDefault);
    };

    /* Publicise object */
    return Touch;
})();