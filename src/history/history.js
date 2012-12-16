!(function (name, factory) {
    if (!factory) {
        factory = name;
        name = null;
    }
    if (typeof define === 'function') {
        // *MD Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        exports = factory(require('jquery'));
    } else {
        var $ = this.jQuery || this.$;
        var ret = factory($);
        // Assign to common namespaces or simply the global object (window)
        name && ret && (($ || this)[name] = ret);
    }
})('history', function ($) {

    /*
     * browser.js: Browser specific functionality for director.
     *
     * (C) 2011, Nodejitsu Inc.
     * MIT LICENSE
     *
     */
    var dloc = document.location;
    var _listeners = [];

    function dlocHashEmpty() {
        // Non-IE browsers return '' when the address bar shows '#'; Director's logic
        // assumes both mean empty.
        return dloc.hash === '' || dloc.hash === '#';
    }

    var history = {

        mode: 'modern',
        hash: dloc.hash,
        history : (window.history != null ? window.history.pushState : null) != null,



        fire: function () {
            if (this.mode === 'modern') {
                this.history === true ? window.onpopstate() : window.onhashchange();
            }
            else {
                this.onHashChanged();
            }
        },

        on : function(){
            _listeners.push(fn);
        },

        off: function (fn) {

            var listeners = _listeners;

            for (var i = listeners.length - 1; i >= 0; i--) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                }
            }
        },

        check: function () {
            var h = dloc.hash;
            if (h != this.hash) {
                this.hash = h;
                this.onHashChanged();
            }
        },

        init: function (fn) {
            var self = this;

            //note IE8 is being counted as 'modern' because it has the hashchange event
            if ('onhashchange' in window && (document.documentMode === undefined
                || document.documentMode > 7)) {
                // At least for now HTML5 history is available for 'modern' browsers only
                if (this.history === true) {
                    // There is an old bug in Chrome that causes onpopstate to fire even
                    // upon initial page load. Since the handler is run manually in init(),
                    // this would cause Chrome to run it twise. Currently the only
                    // workaround seems to be to set the handler after the initial page load
                    // http://code.google.com/p/chromium/issues/detail?id=63040
                    setTimeout(function() {
                        window.onpopstate = self.onHashChanged;
                    }, 500);
                }
                else {
                    window.onhashchange = self.onHashChanged;
                }
                this.mode = 'modern';
            }
            else {
                //
                // IE support, based on a concept by Erik Arvidson ...
                //
                var frame = document.createElement('iframe');
                frame.id = 'state-frame';
                frame.style.display = 'none';
                document.body.appendChild(frame);
                this.writeFrame('');

                if ('onpropertychange' in document && 'attachEvent' in document) {
                    document.attachEvent('onpropertychange', function () {
                        if (event.propertyName === 'location') {
                            self.check();
                        }
                    });
                }

                window.setInterval(function () { self.check(); }, 50);

                this.mode = 'legacy';
            }

            _listeners.push(fn);

            return this.mode;
        },

        writeFrame: function (s) {
            // IE support...
            var f = document.getElementById('state-frame');
            var d = f.contentDocument || f.contentWindow.document;
            d.open();
            d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
            d.close();
        },

        setHash: function (s) {
            // Mozilla always adds an entry to the history
            if (this.mode === 'legacy') {
                this.writeFrame(s);
            }

            if (this.history === true) {
                window.history.pushState({}, document.title, s);
                // Fire an onpopstate event manually since pushing does not obviously
                // trigger the pop event.
                this.fire();
            } else {
                dloc.hash = (s[0] === '/') ? s : '/' + s;
            }
            return this;
        },


        syncHash: function () {
            // IE support...
            var s = this._hash;
            if (s != dloc.hash) {
                dloc.hash = s;
            }
            return this;
        },

        onHashChanged: function (onChangeEvent) {
            for (var i = 0, l = _listeners.length; i < l; i++) {
                _listeners[i](onChangeEvent);
            }
        }
    };
    
    return history;
})