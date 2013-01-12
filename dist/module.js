
define('$',['require','exports','module','jquery'],function (require, exports, module) {
    return require('jquery');
});
!(function (factory) {
    if (typeof define === 'function') {
        define('class/class',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
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
});
!(function (factory) {
    if (typeof define === 'function') {
        define('cookie/cookie',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'cookie';
    /*!
     * jQuery Cookie Plugin v1.3
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2011, Klaus Hartl
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.opensource.org/licenses/GPL-2.0
     */
    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $[pluginName] = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? $.json.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ?  $.json.parse(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    return $[pluginName];

});
!(function (factory) {
    if (typeof define === 'function') {
        define('cookie/remove',['$', './cookie'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    return $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };
})

;
!(function (factory) {
    if (typeof define === 'function') {
        define('cors/img',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    // http://api.jquery.com/extending-ajax/
    $.ajaxTransport( "image", function( s ) {

        if ( s.type === "GET" && s.async ) {

            var image;

            return {

                send: function( _ , callback ) {

                    image = new Image();

                    function done( status ) {
                        if ( image ) {
                            var statusText = ( status == 200 ) ? "success" : "error",
                                tmp = image;
                            image = image.onreadystatechange = image.onerror = image.onload = null;
                            callback( status, statusText, { image: tmp } );
                        }
                    }

                    image.onreadystatechange = image.onload = function() {
                        done( 200 );
                    };
                    image.onerror = function() {
                        done( 404 );
                    };

                    image.src = s.url;
                },

                abort: function() {
                    if ( image ) {
                        image = image.onreadystatechange = image.onerror = image.onload = null;
                    }
                }
            };
        }
    });

});
!(function (factory) {
    if (typeof define === 'function') {
        define('cors/xdr',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    // http://msdn.microsoft.com/en-us/library/cc288060(v=vs.85).aspx
    if (window.XDomainRequest && !$.support.cors) {
        $.ajaxTransport(function (s) {
            if (s.crossDomain && s.async) {
                if (s.timeout) {
                    s.xdrTimeout = s.timeout;
                    delete s.timeout;
                }
                var xdr;
                return {
                    send: function (headers, completeCallback) {
                        function callback(status, statusText, responses, responseHeaders) {
                            xdr.onload = xdr.onerror = xdr.ontimeout = xdr.onprogress = $.noop;
                            xdr = null;
                            completeCallback(status, statusText, responses, responseHeaders);
                        }
                        xdr = new XDomainRequest();

                        // XDomainRequest only supports GET and POST:
                        if (s.type === 'DELETE') {
                            s.url = s.url + (/\?/.test(s.url) ? '&' : '?') +
                                '_method=DELETE';
                            s.type = 'POST';
                        } else if (s.type === 'PUT') {
                            s.url = s.url + (/\?/.test(s.url) ? '&' : '?') +
                                '_method=PUT';
                            s.type = 'POST';
                        }
                        xdr.open(s.type, s.url);

                        // IE9 has a bug that requires the xdr.onprogress method to be set. We'll just set them all, just in case.
                        // (http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e)
                        xdr.onload = xdr.onerror = xdr.ontimeout = xdr.onprogress = $.noop;

                        xdr.onload = function () {
                            callback(
                                200,
                                'success',
                                {text: xdr.responseText},
                                'Content-Type: ' + xdr.contentType
                            );
                        };
                        xdr.onerror = function () {
                            callback(400, 'failed');
                        };
                        if (s.xdrTimeout) {
                            xdr.ontimeout = function () {
                                callback(408, 'timeout');
                            };
                            xdr.timeout = s.xdrTimeout;
                        }
                        xdr.send((s.hasContent && s.data) || null);
                    },

                    abort: function () {
                        if (xdr) {
                            xdr.onerror = $.noop();
                            xdr.abort();
                        }
                    }
                };
            }
        });
    }

});
!(function (factory) {
    if (typeof define === 'function') {
        define('history/history',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'history';

    // https://github.com/documentcloud/backbone/blob/master/backbone.js
    // http://backbonejs.org/#History
    
    // Handles cross-browser history management, based on URL fragments. If the
    // browser does not support `onhashchange`, falls back to polling.
    var History = function() {
        this.handlers = [];
        // _.bindAll(this, 'checkUrl');
        $.proxy(this, 'checkUrl');
        // Ensure that `History` can be used outside of the browser.
        if (typeof window !== 'undefined') {
            this.location = window.location;
            this.history = window.history;
        }
    };

    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;

    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;

    // Cached regex for detecting MSIE.
    var isExplorer = /msie [\w.]+/;

    // Cached regex for removing a trailing slash.
    var trailingSlash = /\/$/;

    // Has the history handling already been started?
    History.started = false;

    // Set up all inheritable **History** properties and methods.
    History.prototype = {

        // The default interval to poll for hash changes, if necessary, is
        // twenty times a second.
        interval: 50,

        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function(window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        },

        // Get the cross-browser normalized URL fragment, either from the URL,
        // the hash, or the override.
        getFragment: function(fragment, forcePushState) {
            if (fragment == null) {
                if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                    fragment = this.location.pathname;
                    var root = this.root.replace(trailingSlash, '');
                    if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
                } else {
                    fragment = this.getHash();
                }
            }
            return fragment.replace(routeStripper, '');
        },

        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start: function(options) {
            if (History.started) throw new Error("history has already been started");
            History.started = true;

            // Figure out the initial configuration. Do we need an iframe?
            // Is pushState desired ... is it available?
            this.options          = $.extend({}, {root: '/'}, this.options, options);
            this.root             = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState  = !!this.options.pushState;
            this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
            var fragment          = this.getFragment();
            var docMode           = document.documentMode;
            var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

            // Normalize root to always include a leading and trailing slash.
            this.root = ('/' + this.root + '/').replace(rootStripper, '/');

            if (oldIE && this._wantsHashChange) {
                this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
                this.navigate(fragment);
            }

            // Depending on whether we're using pushState or hashes, and whether
            // 'onhashchange' is supported, determine how we check the URL state.
            if (this._hasPushState) {
                // As of jQuery 1.7, the .on() method is the preferred method for attaching event handlers to a document.
                $(window).on('popstate', this.checkUrl);
            } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
                $(window).on('hashchange', this.checkUrl);
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
            }

            // Determine if we need to change the base url, for a pushState link
            // opened by a non-pushState browser.
            this.fragment = fragment;
            var loc = this.location;
            var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

            // If we've started off with a route from a `pushState`-enabled browser,
            // but we're currently in a browser that doesn't support it...
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
                this.fragment = this.getFragment(null, true);
                this.location.replace(this.root + this.location.search + '#' + this.fragment);
                // Return immediately as browser will do redirect to new url
                return true;

                // Or if we've started out with a hash-based route, but we're currently
                // in a browser where it could be `pushState`-based instead...
            } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
                this.fragment = this.getHash().replace(routeStripper, '');
                this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
            }

            if (!this.options.silent) return this.loadUrl();
        },

        // Disable history, perhaps temporarily. Not useful in a real app,
        // but possibly useful for unit testing Routers.
        stop: function() {
            $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
            clearInterval(this._checkUrlInterval);
            History.started = false;
        },

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        route: function(route, callback) {
            this.handlers.unshift({route: route, callback: callback});
        },

        // Checks the current URL to see if it has changed, and if it has,
        // calls `loadUrl`, normalizing across the hidden iframe.
        checkUrl: function(e) {
            var current = this.getFragment();
            if (current === this.fragment && this.iframe) {
                current = this.getFragment(this.getHash(this.iframe));
            }
            if (current === this.fragment) return false;
            if (this.iframe) this.navigate(current);
            this.loadUrl() || this.loadUrl(this.getHash());
        },

        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        loadUrl: function(fragmentOverride) {
            var fragment = this.fragment = this.getFragment(fragmentOverride);
            var matched = false;

            $.each(this.handlers, function(i, handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    matched = true;
                }
            });

            return matched;
        },

        // Save a fragment into the hash history, or replace the URL state if the
        // 'replace' option is passed. You are responsible for properly URL-encoding
        // the fragment in advance.
        //
        // The options object can contain `trigger: true` if you wish to have the
        // route callback be fired (not usually desirable), or `replace: true`, if
        // you wish to modify the current URL without adding an entry to the history.
        navigate: function(fragment, options) {
            if (!History.started) return false;
            if (!options || options === true) options = {trigger: options};
            fragment = this.getFragment(fragment || '');
            if (this.fragment === fragment) return;
            this.fragment = fragment;
            var url = this.root + fragment;

            // If pushState is available, we use it to set the fragment as a real URL.
            if (this._hasPushState) {
                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

                // If hash changes haven't been explicitly disabled, update the hash
                // fragment to store history.
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
                    // Opening and closing the iframe tricks IE7 and earlier to push a
                    // history entry on hash-tag change.  When replace is true, we don't
                    // want this.
                    if(!options.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, fragment, options.replace);
                }

                // If you've told us that you explicitly don't want fallback hashchange-
                // based history, then `navigate` becomes a page refresh.
            } else {
                return this.location.assign(url);
            }
            if (options.trigger) this.loadUrl(fragment);
        },

        // Update the hash location, either replacing the current entry, or adding
        // a new one to the browser history.
        _updateHash: function(location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, '');
                location.replace(href + '#' + fragment);
            } else {
                // Some browsers require that `hash` contains a leading #.
                location.hash = '#' + fragment;
            }
        }

    };

    $.History = History;
    // Create the default history.
    return $[pluginName] = new History;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('json/json',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'json';

    return $[pluginName] = {
        // http://api.jquery.com/jQuery.parseJSON/
        parse : $.parseJSON,

        stringify  : function stringify(obj) {
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }

            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';

                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                            v = '"' + v + '"';
                        } else if (t == "object" && v !== null){
                            v = $.json.stringify(v);
                        }

                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    }

});
!(function (factory) {
    if (typeof define === 'function') {
        define('jsonpi/jsonpi',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    /**
     * jquery.jsonpi.js
     *
     * JSONPI "ajax" transport implementation for jQuery.
     *
     * http://github.com/benvinegar/jquery-jsonpi
     */
    $.ajaxTransport('jsonpi', function(options, originalOptions, jqXHR) {

        var jsonpCallback = options.jsonpCallback =
                jQuery.isFunction(options.jsonpCallback) ? options.jsonpCallback() : options.jsonpCallback;
        var previous = window[jsonpCallback];
        var url = options.url;


        if (options.type == 'GET'){
            options.params[options.jsonp] = jsonpCallback;
        }else{
            url += (/\?/.test( url ) ? "&" : "?") + options.jsonp + "=" + jsonpCallback;
        }

        var iframe, form;

        return {
            send: function(_, completeCallback) {
                form = $('<form style="display:none;"></form>');
                var name = 'jQuery_iframe_' + jQuery.now();

                // Install callback
                window[jsonpCallback] = function(data) {
                    // TODO: How to handle errors? Only 200 for now
                    // The complete callback returns the
                    // iframe content document as response object:
                    completeCallback(
                        200,
                        'OK',
                        {'jsonpi': data}
                    );
                    // Fix for IE endless progress bar activity bug
                    // (happens on form submits to iframe targets):
                    $('<iframe src="javascript:false;"></iframe>')
                        .appendTo(form);
                    form.remove();

                    window[jsonpCallback] = previous;
                };
                // javascript:false as initial iframe src
                // prevents warning popups on HTTPS in IE6.
                // IE versions below IE8 cannot set the name property of
                // elements that have already been added to the DOM,
                // so we set the name along with the iframe HTML markup:
                // http://gemal.dk/blog/2005/01/27/iframe_without_src_attribute_on_https_in_internet_explorer/
                iframe = $('<iframe src="javascript:false;"></iframe>', { name: name })
                .bind('load', function () {

                    iframe
                        .unbind('load')
                        .bind('load', function () {
                            var response;
                            // Wrap in a try/catch block to catch exceptions thrown
                            // when trying to access cross-domain iframe contents:
                            try {
                                response = iframe.contents();
                                // Google Chrome and Firefox do not throw an
                                // exception when calling iframe.contents() on
                                // cross-domain requests, so we unify the response:
                                if (!response.length || !response[0].firstChild) {
                                    throw new Error();
                                }
                            } catch (e) {
                                response = undefined;
                            }

                            window[jsonpCallback](response);

                        });


                    form
                        .attr('target', name)
                        .attr('action', url)
                        .attr('method', options.type);

                    if(options.params){
                        $.each(options.params, function(k, v) {
                            $('<input>')
                                .attr('type', 'hidden')
                                .attr('name', k)
                                .val(v)
                                .appendTo(form);
                        });
                    }

                    form.submit();
                });

                form.append(iframe).appendTo(document.body);

            },

            abort: function() {
                if (iframe) {
                    // javascript:false as iframe src aborts the request
                    // and prevents warning popups on HTTPS in IE6.
                    iframe.prop('src', 'javascript:false;');
                }
                if (form) {
                    form.remove();
                }
            }
        };
    });

});
!(function (factory) {
    if (typeof define === 'function') {
        define('key/key',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'key';

    var global = $;

    //     keymaster.js
    //     (c) 2011-2012 Thomas Fuchs
    //     keymaster.js may be freely distributed under the MIT license.
    var k,
        _handlers = {},
        _mods = { 16: false, 18: false, 17: false, 91: false },
        _scope = 'all',
    // modifier keys
        _MODIFIERS = {
            '⇧': 16, shift: 16,
            '⌥': 18, alt: 18, option: 18,
            '⌃': 17, ctrl: 17, control: 17,
            '⌘': 91, command: 91
        },
    // special keys
        _MAP = {
            backspace: 8, tab: 9, clear: 12,
            enter: 13, 'return': 13,
            esc: 27, escape: 27, space: 32,
            left: 37, up: 38,
            right: 39, down: 40,
            del: 46, 'delete': 46,
            home: 36, end: 35,
            pageup: 33, pagedown: 34,
            ',': 188, '.': 190, '/': 191,
            '`': 192, '-': 189, '=': 187,
            ';': 186, '\'': 222,
            '[': 219, ']': 221, '\\': 220
        },
        _downKeys = [];

    for(k=1;k<20;k++) _MODIFIERS['f'+k] = 111+k;

    // IE doesn't support Array#indexOf, so have a simple replacement
    function index(array, item){
        var i = array.length;
        while(i--) if(array[i]===item) return i;
        return -1;
    }

    // handle keydown event
    function dispatch(event, scope){
        var key, handler, k, i, modifiersMatch;
        key = event.keyCode;

        if (index(_downKeys, key) == -1) {
            _downKeys.push(key);
        }

        // if a modifier key, set the key.<modifierkeyname> property to true and return
        if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
        if(key in _mods) {
            _mods[key] = true;
            // 'assignKey' from inside this closure is exported to window.key
            for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
            return;
        }

        // see if we need to ignore the keypress (filter() can can be overridden)
        // by default ignore key presses if a select, textarea, or input is focused
        if(!assignKey.filter.call(this, event)) return;

        // abort if no potentially matching shortcuts found
        if (!(key in _handlers)) return;

        // for each potential shortcut
        for (i = 0; i < _handlers[key].length; i++) {
            handler = _handlers[key][i];

            // see if it's in the current scope
            if(handler.scope == scope || handler.scope == 'all'){
                // check if modifiers match if any
                modifiersMatch = handler.mods.length > 0;
                for(k in _mods)
                    if((!_mods[k] && index(handler.mods, +k) > -1) ||
                        (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
                // call the handler and stop the event if neccessary
                if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
                    if(handler.method(event, handler)===false){
                        if(event.preventDefault) event.preventDefault();
                        else event.returnValue = false;
                        if(event.stopPropagation) event.stopPropagation();
                        if(event.cancelBubble) event.cancelBubble = true;
                    }
                }
            }
        }
    };

    // unset modifier keys on keyup
    function clearModifier(event){
        var key = event.keyCode, k,
            i = index(_downKeys, key);

        // remove key from _downKeys
        if (i >= 0) {
            _downKeys.splice(i, 1);
        }

        if(key == 93 || key == 224) key = 91;
        if(key in _mods) {
            _mods[key] = false;
            for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
        }
    };

    function resetModifiers() {
        for(k in _mods) _mods[k] = false;
        for(k in _MODIFIERS) assignKey[k] = false;
    }

    // parse and assign shortcut
    function assignKey(key, scope, method){
        var keys, mods, i, mi;
        if (method === undefined) {
            method = scope;
            scope = 'all';
        }
        key = key.replace(/\s/g,'');
        keys = key.split(',');

        if((keys[keys.length-1])=='')
            keys[keys.length-2] += ',';
        // for each shortcut
        for (i = 0; i < keys.length; i++) {
            // set modifier keys if any
            mods = [];
            key = keys[i].split('+');
            if(key.length > 1){
                mods = key.slice(0,key.length-1);
                for (mi = 0; mi < mods.length; mi++)
                    mods[mi] = _MODIFIERS[mods[mi]];
                key = [key[key.length-1]];
            }
            // convert to keycode and...
            key = key[0]
            key = _MAP[key] || key.toUpperCase().charCodeAt(0);
            // ...store handler
            if (!(key in _handlers)) _handlers[key] = [];
            _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
        }
    };

    // Returns true if the key with code 'keyCode' is currently down
    // Converts strings into key codes.
    function isPressed(keyCode) {
        if (typeof(keyCode)=='string') {
            if (keyCode.length == 1) {
                keyCode = (keyCode.toUpperCase()).charCodeAt(0);
            } else {
                return false;
            }
        }
        return index(_downKeys, keyCode) != -1;
    }

    function getPressedKeyCodes() {
        return _downKeys;
    }

    function filter(event){
        var tagName = (event.target || event.srcElement).tagName;
        // ignore keypressed in any elements that support keyboard data input
        return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    }

    // initialize key.<modifier> to false
    for(k in _MODIFIERS) assignKey[k] = false;

    // set current scope (default 'all')
    function setScope(scope){ _scope = scope || 'all' };
    function getScope(){ return _scope || 'all' };

    // delete all handlers for a given scope
    function deleteScope(scope){
        var key, handlers, i;

        for (key in _handlers) {
            handlers = _handlers[key];
            for (i = 0; i < handlers.length; ) {
                if (handlers[i].scope === scope) handlers.splice(i, 1);
                else i++;
            }
        }
    };

    // cross-browser events
    function addEvent(object, event, method) {
        if (object.addEventListener)
            object.addEventListener(event, method, false);
        else if(object.attachEvent)
            object.attachEvent('on'+event, function(){ method(window.event) });
    };

    // set the handlers globally on document
    addEvent(document, 'keydown', function(event) { dispatch(event, _scope) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
    addEvent(document, 'keyup', clearModifier);

    // reset modifiers to false whenever the window is (re)focused.
    addEvent(window, 'focus', resetModifiers);

    // store previously defined key
    var previousKey = global.key;

    // restore previously defined key and return reference to our key object
    function noConflict() {
        var k = global.key;
        global.key = previousKey;
        return k;
    }

    // set window.key and window.key.set/get/deleteScope, and the default filter
    global.key = assignKey;
    global.key.setScope = setScope;
    global.key.getScope = getScope;
    global.key.deleteScope = deleteScope;
    global.key.filter = filter;
    global.key.isPressed = isPressed;
    global.key.getPressedKeyCodes = getPressedKeyCodes;
    global.key.noConflict = noConflict;

    return global.key;

});
!(function (factory) {
    if (typeof define === 'function') {
        define('memoize/memoize',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'memoize';

    $[pluginName] = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.unmemoized = fn;
        return memoized;
    };

    $['un'+pluginName] = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

});
!(function (factory) {
    if (typeof define === 'function') {
        define('mousewheel/mousewheel',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'mousewheel';

    /*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
     * Licensed under the MIT License (LICENSE.txt).
     *
     * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
     * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
     * Thanks to: Seamus Leahy for adding deltaX and deltaY
     *
     * Version: 3.0.6
     *
     * Requires: 1.2.2+
     */



    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for ( var i=types.length; i; ) {
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=types.length; i; ) {
                    this.addEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=types.length; i; ) {
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
        if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1*delta;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }



});
!(function (factory) {
    if (typeof define === 'function') {
        define('object/keys',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'keys';

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    return $[pluginName] = Object.keys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (obj.hasOwnProperty(key)) keys[keys.length] = key;
        return keys;
    };

});
!(function (factory) {
    if (typeof define === 'function') {
        define('postmessage/postmessage',['$'], factory);
    } else {
        factory(this.$ = this.$ || {});
    }
})(function ($) {
    
    var pluginName = 'postmessage';

   // A few vars used in non-awesome browsers.
    var interval_id,
        last_hash,
        cache_bust = 1,

    // A var used in awesome browsers.
        rm_callback,

    // A few convenient shortcuts.
        window = this,
        FALSE = !1,

    // Reused internal strings.
        postMessage = 'postMessage',
        addEventListener = 'addEventListener',

        p_receiveMessage,

    // I couldn't get window.postMessage to actually work in Opera 9.64!
    //  has_postMessage = window[postMessage] && !$.browser.opera;
        has_postMessage = window[postMessage];

    // Method: jQuery.postMessage
    //
    // This method will call window.postMessage if available, setting the
    // targetOrigin parameter to the base of the target_url parameter for maximum
    // security in browsers that support it. If window.postMessage is not available,
    // the target window's location.hash will be used to pass the message. If an
    // object is passed as the message param, it will be serialized into a string
    // using the jQuery.param method.
    //
    // Usage:
    //
    // > jQuery.postMessage( message, target_url [, target ] );
    //
    // Arguments:
    //
    //  message - (String) A message to be passed to the other frame.
    //  target_url - (String) The URL of the other frame this window is
    //    attempting to communicate with. This must be the exact URL (including
    //    any query string) of the other window for this script to work in
    //    browsers that don't support window.postMessage.
    //  target - (Object) A reference to the other frame this window is
    //    attempting to communicate with. If omitted, defaults to `parent`.
    //
    // Returns:
    //
    //  Nothing.

    $[postMessage] = function( message, target_url, target ) {
        if ( !target_url ) { return; }

        // Serialize the message if not a string. Note that this is the only real
        // jQuery dependency for this script. If removed, this script could be
        // written as very basic JavaScript.
        message =  ''+message;

        // Default to parent if unspecified.
        target = target || parent;

        if ( has_postMessage ) {
            // The browser supports window.postMessage, so call it with a targetOrigin
            // set appropriately, based on the target_url parameter.
            target[postMessage]( message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1' ) );

        } else if ( target_url ) {
            // The browser does not support window.postMessage, so set the location
            // of the target to target_url#message. A bit ugly, but it works! A cache
            // bust parameter is added to ensure that repeat messages trigger the
            // callback.
            target.location = target_url.replace( /#.*$/, '' ) + '#' + (+new Date) + (cache_bust++) + '&' + encodeURIComponent(message);
        }
    };

    // Method: jQuery.receiveMessage
    //
    // Register a single callback for either a window.postMessage call, if
    // supported, or if unsupported, for any change in the current window
    // location.hash. If window.postMessage is supported and source_origin is
    // specified, the source window will be checked against this for maximum
    // security. If window.postMessage is unsupported, a polling loop will be
    // started to watch for changes to the location.hash.
    //
    // Note that for simplicity's sake, only a single callback can be registered
    // at one time. Passing no params will unbind this event (or stop the polling
    // loop), and calling this method a second time with another callback will
    // unbind the event (or stop the polling loop) first, before binding the new
    // callback.
    //
    // Also note that if window.postMessage is available, the optional
    // source_origin param will be used to test the event.origin property. From
    // the MDC window.postMessage docs: This string is the concatenation of the
    // protocol and "://", the host name if one exists, and ":" followed by a port
    // number if a port is present and differs from the default port for the given
    // protocol. Examples of typical origins are https://example.org (implying
    // port 443), http://example.net (implying port 80), and http://example.com:8080.
    //
    // Usage:
    //
    // > jQuery.receiveMessage( callback [, source_origin ] [, delay ] );
    //
    // Arguments:
    //
    //  callback - (Function) This callback will execute whenever a <jQuery.postMessage>
    //    message is received, provided the source_origin matches. If callback is
    //    omitted, any existing receiveMessage event bind or polling loop will be
    //    canceled.
    //  source_origin - (String) If window.postMessage is available and this value
    //    is not equal to the event.origin property, the callback will not be
    //    called.
    //  source_origin - (Function) If window.postMessage is available and this
    //    function returns false when passed the event.origin property, the
    //    callback will not be called.
    //  delay - (Number) An optional zero-or-greater delay in milliseconds at
    //    which the polling loop will execute (for browser that don't support
    //    window.postMessage). If omitted, defaults to 100.
    //
    // Returns:
    //
    //  Nothing!

    $.receiveMessage = p_receiveMessage = function( callback, source_origin, delay ) {
        if ( has_postMessage ) {
            // Since the browser supports window.postMessage, the callback will be
            // bound to the actual event associated with window.postMessage.

            if ( callback ) {
                // Unbind an existing callback if it exists.
                rm_callback && p_receiveMessage();

                // Bind the callback. A reference to the callback is stored for ease of
                // unbinding.
                rm_callback = function(e) {
                    if ( ( typeof source_origin === 'string' && e.origin !== source_origin )
                        || ( typeof source_origin === 'function' && source_origin( e.origin ) === FALSE ) ) {
                        return FALSE;
                    }
                    callback( e );
                };
            }

            if ( window[addEventListener] ) {
                window[ callback ? addEventListener : 'removeEventListener' ]( 'message', rm_callback, FALSE );
            } else {
                window[ callback ? 'attachEvent' : 'detachEvent' ]( 'onmessage', rm_callback );
            }

        } else {
            // Since the browser sucks, a polling loop will be started, and the
            // callback will be called whenever the location.hash changes.

            interval_id && clearInterval( interval_id );
            interval_id = null;

            if ( callback ) {
                delay = typeof source_origin === 'number'
                    ? source_origin
                    : typeof delay === 'number'
                    ? delay
                    : 100;

                interval_id = setInterval(function(){
                    var hash = document.location.hash,
                        re = /^#?\d+&/;
                    if ( hash !== last_hash && re.test( hash ) ) {
                        last_hash = hash;
                        callback({ data: decodeURIComponent(hash.replace( re, '' )) });
                    }
                }, delay );
            }
        }
    };

    $[pluginName] = {
        postMessage: $[postMessage]
        ,receiveMessage: $.receiveMessage
    };
});
!(function (factory) {
    if (typeof define === 'function') {
        define('route/route',['$', '../history/history', '../object/keys'], factory);
    } else {
        factory($);
    }
})(function ($) {

    
    var pluginName = 'route';
    var history = $.history;
    var keys = $.keys;

    // $.Router
    // ---------------

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router =  function(options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Set up all inheritable **$.Router** properties and methods.
    Router.prototype = {

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){},

        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function(route, name, callback) {
            if (typeof route === 'string') route = this._routeToRegExp(route);
            if (!callback) callback = this[name];
            history.route(route, $.proxy(function(fragment) {
                var args = this._extractParameters(route, fragment);
                callback && callback.apply(this, args);
                // TODO: support it
                //this.trigger.apply(this, ['route:' + name].concat(args));

                //history.trigger('route', this, name, args);
            }, this));
            return this;
        },

        // Simple proxy to `$.history` to save a fragment into the history.
        navigate: function(fragment, options) {
            history.navigate(fragment, options);
            return this;
        },

        // Bind all defined routes to `$.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function() {
            if (!this.routes) return;
            var route, routes = keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, '([^\/]+)')
                .replace(splatParam, '(.*?)');
            return new RegExp('^' + route + '$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted parameters.
        _extractParameters: function(route, fragment) {
            return route.exec(fragment).slice(1);
        }

    };

    return $.Router = Router;

});
!(function (factory) {
    if (typeof define === 'function') {
        define('storage/storage',['$', '../json/json'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    var pluginName = 'storage';
    var JSON = $.json;

    /* Copyright (c) 2010-2012 Marcus Westin
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var store = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        namespace = '__storejs__',
        storage

    store.disabled = false
    store.set = function(key, value) {}
    store.get = function(key) {}
    store.remove = function(key) {}
    store.clear = function() {}
    store.transact = function(key, defaultVal, transactionFn) {
        var val = store.get(key)
        if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
        }
        if (typeof val == 'undefined') { val = defaultVal || {} }
        transactionFn(val)
        store.set(key, val)
    }
    store.getAll = function() {}

    store.serialize = function(value) {
        return JSON.stringify(value)
    }
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    }

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    function isGlobalStorageNameSupported() {
        try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
        catch(err) { return false }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val))
            return val
        }
        store.get = function(key) { return store.deserialize(storage.getItem(key)) }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i)
                ret[key] = store.get(key)
            }
            return ret
        }
    } else if (isGlobalStorageNameSupported()) {
        storage = win[globalStorageName][win.location.hostname]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage[key] = store.serialize(val)
            return val
        }
        store.get = function(key) { return store.deserialize(storage[key] && storage[key].value) }
        store.remove = function(key) { delete storage[key] }
        store.clear = function() { for (var key in storage ) { delete storage[key] } }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i)
                ret[key] = store.get(key)
            }
            return ret
        }

    } else if (doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile')
            storageContainer.open()
            storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
            storageContainer.close()
            storageOwner = storageContainer.w.frames[0].document
            storage = storageOwner.createElement('div')
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div')
            storageOwner = doc.body
        }
        function withIEStorage(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0)
                args.unshift(storage)
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage)
                storage.addBehavior('#default#userData')
                storage.load(localStorageName)
                var result = storeFunction.apply(store, args)
                storageOwner.removeChild(storage)
                return result
            }
        }

        // In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
        function ieKeyFix(key) {
            return key.replace(forbiddenCharsRegex, '___')
        }
        store.set = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key)
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val))
            storage.save(localStorageName)
            return val
        })
        store.get = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            return store.deserialize(storage.getAttribute(key))
        })
        store.remove = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            storage.removeAttribute(key)
            storage.save(localStorageName)
        })
        store.clear = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            storage.load(localStorageName)
            for (var i=0, attr; attr=attributes[i]; i++) {
                storage.removeAttribute(attr.name)
            }
            storage.save(localStorageName)
        })
        store.getAll = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            storage.load(localStorageName)
            var ret = {}
            for (var i=0, attr; attr=attributes[i]; ++i) {
                ret[attr] = store.get(attr)
            }
            return ret
        })
    }

    try {
        store.set(namespace, namespace)
        if (store.get(namespace) != namespace) { store.disabled = true }
        store.remove(namespace)
    } catch(e) {
        store.disabled = true
    }
    store.enabled = !store.disabled

    // Expose
    return $[pluginName] = store;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('string/color',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    var RGB = /([\\d]{1,3})/g;
    var HEX = /^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$/;

    var color =   {
        /**
         * Function: rgbToHex
         * RGB格式转化为HEX
         *
         * Parameters:
         *  rgb - {String}
         *  array - {Boolean} 以数组格式返回
         *
         * Returns:
         *   {String} hexText #1e2fcc
         */
        rgbToHex : function(rgb, array){
            rgb = rgb.match(RGB);
            if (rgb[3] == 0)
                return 'transparent';
            var hex = [];
            for (var i = 0; i < 3; i++) {
                var bit = (rgb[i] - 0).toString(16);
                hex.push(bit.length == 1 ? '0' + bit : bit);
            }

            if (array) {
                return hex;
            }
            else {
                var hexText = '#' + hex.join('');
                return hexText;
            }
        },

        /**
         * Function: hexToRgb
         * HEX格式转化为RGB
         *
         * Parameters:
         *  hex - {String}
         *  array - {Boolean} 以数组格式返回
         *
         * Returns:
         *  {String|Array}
         *
         * Example:
         * (code)
         *    hexToRgb("#FFF",true) //[255,255,255]
         * (end)
         */
        hexToRgb : function(hex, array){
            hex = hex.match(HEX);
            var rgb = [];
            for (var i = 1; i < hex.length; i++) {
                if (hex[i].length == 1)
                    hex[i] += hex[i];
                rgb.push(parseInt(hex[i], 16));
            }

            if (array) {
                return rgb;
            }
            else {
                var rgbText = 'rgb(' + rgb.join(',') + ')';
                return rgbText;
            }
        }

    };

    $.extend($, color);

    return color;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('string/format',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    var format = {

        /**
         * Function: camelize
         * 把Css属性名格式化为骆驼型
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String} camelize
         *
         * Example:
         *  var before= "font-size";
         *  var after= camelize(before); //"fontSize"
         */
        camelize : function(str){
            return str.replace(/-\D/gi, function(match){
                return match.charAt(match.length - 1).toUpperCase();
            });
        },

        /**
         * Function: format
         * 以模板方式格式化文本
         *
         * Parameters:
         *  temp - {String}
         *  value1 - {String|Number|Boolean} The value to replace token {1}
         *  value2 - {String|Number|Boolean} Etc...
         *
         * Returns:
         *   {String}
         *
         * Example:
         * (code)
         * format("{1},{2}",1,2) === 1,2
         * format("{1},{1}",1)  === 1,1
         * (end)
         */
        format : function(temp){

            var args = Array.prototype.slice.call(arguments, 1 );

            return temp.replace(/\{(\d+)\}/g, function(m, i){
                if (args[i-1]) {
                    return args[i-1];
                }
                else {
                    return "";
                }
            });
        }

    };

    $.extend($, format);
    return format;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('string/trim',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    var LEFT = /^\s+/;
    var RIGHT = /\s+$/;

    var StringProto = String.prototype;
    var nativeTrim = StringProto.trim;
    var nativeTrimRight = StringProto.trimRight;
    var nativeTrimLeft = StringProto.trimLeft;

    var trim = {
        /**
         * Function: trim
         * ECMA-262-5 15.5.4.20
         * Trims whitespace from both ends of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String}
         */
        trim: function(str){
            if (str == null) return '';
            if (nativeTrim) return nativeTrim.call(str);
            return str.replace(LEFT, "").replace(RIGHT, "");
        },
        /**
         * Function: trimLeft
         * Trims whitespace from the left side of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *   {String}
         */
        trimLeft: function(str){
            if (str == null) return '';
            if (nativeTrimLeft) return nativeTrimLeft.call(str);
            return str.replace(LEFT, "");
        },

        /**
         * Function: trimRight
         * Trims whitespace from the right side of the string
         *
         * Parameters:
         *  str - {String}
         *
         * Returns:
         *  {String}
         */
        trimRight : function(str){
            if (str == null) return '';
            if (nativeTrimRight) return nativeTrimRight.call(str);
            return str.replace(RIGHT, "");
        }
    };

    $.extend($, trim);
    return trim;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('template/template',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    

    var pluginName = 'template';

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    $.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    var template = function(text, data, settings) {
        var render;
        settings = $.extend({}, settings, $.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':$('<a/>').text(__t).html())+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '$', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, $);
        var template = function(data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    return $[pluginName] = template;
});
!(function (factory) {
    if (typeof define === 'function') {
        define('touch/touch',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'touch';

    /*
     * Hammer.JS
     * version 0.6.4
     * author: Eight Media
     * https://github.com/EightMedia/hammer.js
     * Licensed under the MIT license.
     */
    function Hammer(element, options, undefined)
    {
        var self = this;

        var defaults = {
            // prevent the default event or not... might be buggy when false
            prevent_default    : false,
            css_hacks          : true,

            swipe              : true,
            swipe_time         : 200,   // ms
            swipe_min_distance : 20,   // pixels

            drag               : true,
            drag_vertical      : true,
            drag_horizontal    : true,
            // minimum distance before the drag event starts
            drag_min_distance  : 20,    // pixels

            // pinch zoom and rotation
            transform          : true,
            scale_treshold     : 0.1,
            rotation_treshold  : 15,    // degrees

            tap                : true,
            tap_double         : true,
            tap_max_interval   : 300,
            tap_max_distance   : 10,
            tap_double_distance: 20,

            hold               : true,
            hold_timeout       : 500
        };
        options = mergeObject(defaults, options);

        // some css hacks
        (function() {
            if(!options.css_hacks) {
                return false;
            }

            var vendors = ['webkit','moz','ms','o',''];
            var css_props = {
                "userSelect": "none",
                "touchCallout": "none",
                "userDrag": "none",
                "tapHighlightColor": "rgba(0,0,0,0)"
            };

            var prop = '';
            for(var i = 0; i < vendors.length; i++) {
                for(var p in css_props) {
                    prop = p;
                    if(vendors[i]) {
                        prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
                    }
                    element.style[ prop ] = css_props[p];
                }
            }
        })();

        // holds the distance that has been moved
        var _distance = 0;

        // holds the exact angle that has been moved
        var _angle = 0;

        // holds the direction that has been moved
        var _direction = 0;

        // holds position movement for sliding
        var _pos = { };

        // how many fingers are on the screen
        var _fingers = 0;

        var _first = false;

        var _gesture = null;
        var _prev_gesture = null;

        var _touch_start_time = null;
        var _prev_tap_pos = {x: 0, y: 0};
        var _prev_tap_end_time = null;

        var _hold_timer = null;

        var _offset = {};

        // keep track of the mouse status
        var _mousedown = false;

        var _event_start;
        var _event_move;
        var _event_end;

        var _has_touch = ('ontouchstart' in window);

        var _can_tap = false;


        /**
         * option setter/getter
         * @param   string  key
         * @param   mixed   value
         * @return  mixed   value
         */
        this.option = function(key, val) {
            if(val !== undefined) {
                options[key] = val;
            }

            return options[key];
        };


        /**
         * angle to direction define
         * @param  float    angle
         * @return string   direction
         */
        this.getDirectionFromAngle = function( angle ) {
            var directions = {
                down: angle >= 45 && angle < 135, //90
                left: angle >= 135 || angle <= -135, //180
                up: angle < -45 && angle > -135, //270
                right: angle >= -45 && angle <= 45 //0
            };

            var direction, key;
            for(key in directions){
                if(directions[key]){
                    direction = key;
                    break;
                }
            }
            return direction;
        };


        /**
         * destroy events
         * @return  void
         */
        this.destroy = function() {
            if(_has_touch) {
                removeEvent(element, "touchstart touchmove touchend touchcancel", handleEvents);
            }
            // for non-touch
            else {
                removeEvent(element, "mouseup mousedown mousemove", handleEvents);
                removeEvent(element, "mouseout", handleMouseOut);
            }
        };


        /**
         * count the number of fingers in the event
         * when no fingers are detected, one finger is returned (mouse pointer)
         * @param  event
         * @return int  fingers
         */
        function countFingers( event )
        {
            // there is a bug on android (until v4?) that touches is always 1,
            // so no multitouch is supported, e.g. no, zoom and rotation...
            return event.touches ? event.touches.length : 1;
        }


        /**
         * get the x and y positions from the event object
         * @param  event
         * @return array  [{ x: int, y: int }]
         */
        function getXYfromEvent( event )
        {
            event = event || window.event;

            // no touches, use the event pageX and pageY
            if(!_has_touch) {
                var doc = document,
                    body = doc.body;

                return [{
                    x: event.pageX || event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && doc.clientLeft || 0 ),
                    y: event.pageY || event.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && doc.clientTop || 0 )
                }];
            }
            // multitouch, return array with positions
            else {
                var pos = [], src;
                for(var t=0, len=event.touches.length; t<len; t++) {
                    src = event.touches[t];
                    pos.push({ x: src.pageX, y: src.pageY });
                }
                return pos;
            }
        }


        /**
         * calculate the angle between two points
         * @param   object  pos1 { x: int, y: int }
         * @param   object  pos2 { x: int, y: int }
         */
        function getAngle( pos1, pos2 )
        {
            return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
        }

        /**
         * calculate the distance between two points
         * @param   object  pos1 { x: int, y: int }
         * @param   object  pos2 { x: int, y: int }
         */
        function getDistance( pos1, pos2 )
        {
            var x = pos2.x - pos1.x, y = pos2.y - pos1.y;
            return Math.sqrt((x * x) + (y * y));
        }


        /**
         * calculate the scale size between two fingers
         * @param   object  pos_start
         * @param   object  pos_move
         * @return  float   scale
         */
        function calculateScale(pos_start, pos_move)
        {
            if(pos_start.length == 2 && pos_move.length == 2) {
                var start_distance = getDistance(pos_start[0], pos_start[1]);
                var end_distance = getDistance(pos_move[0], pos_move[1]);
                return end_distance / start_distance;
            }

            return 0;
        }


        /**
         * calculate the rotation degrees between two fingers
         * @param   object  pos_start
         * @param   object  pos_move
         * @return  float   rotation
         */
        function calculateRotation(pos_start, pos_move)
        {
            if(pos_start.length == 2 && pos_move.length == 2) {
                var start_rotation = getAngle(pos_start[1], pos_start[0]);
                var end_rotation = getAngle(pos_move[1], pos_move[0]);
                return end_rotation - start_rotation;
            }

            return 0;
        }


        /**
         * trigger an event/callback by name with params
         * @param string name
         * @param array  params
         */
        function triggerEvent( eventName, params )
        {
            // return touches object
            params.touches = getXYfromEvent(params.originalEvent);
            params.type = eventName;

            // trigger callback
            if(isFunction(self["on"+ eventName])) {
                self["on"+ eventName].call(self, params);
            }
        }


        /**
         * cancel event
         * @param   object  event
         * @return  void
         */

        function cancelEvent(event)
        {
            event = event || window.event;
            if(event.preventDefault){
                event.preventDefault();
                event.stopPropagation();
            }else{
                event.returnValue = false;
                event.cancelBubble = true;
            }
        }


        /**
         * reset the internal vars to the start values
         */
        function reset()
        {
            _pos = {};
            _first = false;
            _fingers = 0;
            _distance = 0;
            _angle = 0;
            _gesture = null;
        }


        var gestures = {
            // hold gesture
            // fired on touchstart
            hold : function(event)
            {
                // only when one finger is on the screen
                if(options.hold) {
                    _gesture = 'hold';
                    clearTimeout(_hold_timer);

                    _hold_timer = setTimeout(function() {
                        if(_gesture == 'hold') {
                            triggerEvent("hold", {
                                originalEvent   : event,
                                position        : _pos.start
                            });
                        }
                    }, options.hold_timeout);
                }
            },

            // swipe gesture
            // fired on touchend
            swipe : function(event)
            {
                if (!_pos.move || _gesture === "transform") {
                    return;
                }

                // get the distance we moved
                var _distance_x = _pos.move[0].x - _pos.start[0].x;
                var _distance_y = _pos.move[0].y - _pos.start[0].y;
                _distance = Math.sqrt(_distance_x*_distance_x + _distance_y*_distance_y);

                // compare the kind of gesture by time
                var now = new Date().getTime();
                var touch_time = now - _touch_start_time;

                if(options.swipe && (options.swipe_time > touch_time) && (_distance > options.swipe_min_distance)) {
                    // calculate the angle
                    _angle = getAngle(_pos.start[0], _pos.move[0]);
                    _direction = self.getDirectionFromAngle(_angle);

                    _gesture = 'swipe';

                    var position = { x: _pos.move[0].x - _offset.left,
                        y: _pos.move[0].y - _offset.top };

                    var event_obj = {
                        originalEvent   : event,
                        position        : position,
                        direction       : _direction,
                        distance        : _distance,
                        distanceX       : _distance_x,
                        distanceY       : _distance_y,
                        angle           : _angle
                    };

                    // normal slide event
                    triggerEvent("swipe", event_obj);
                }
            },


            // drag gesture
            // fired on mousemove
            drag : function(event)
            {
                // get the distance we moved
                var _distance_x = _pos.move[0].x - _pos.start[0].x;
                var _distance_y = _pos.move[0].y - _pos.start[0].y;
                _distance = Math.sqrt(_distance_x * _distance_x + _distance_y * _distance_y);

                // drag
                // minimal movement required
                if(options.drag && (_distance > options.drag_min_distance) || _gesture == 'drag') {
                    // calculate the angle
                    _angle = getAngle(_pos.start[0], _pos.move[0]);
                    _direction = self.getDirectionFromAngle(_angle);

                    // check the movement and stop if we go in the wrong direction
                    var is_vertical = (_direction == 'up' || _direction == 'down');

                    if(((is_vertical && !options.drag_vertical) || (!is_vertical && !options.drag_horizontal)) && (_distance > options.drag_min_distance)) {
                        return;
                    }

                    _gesture = 'drag';

                    var position = { x: _pos.move[0].x - _offset.left,
                        y: _pos.move[0].y - _offset.top };

                    var event_obj = {
                        originalEvent   : event,
                        position        : position,
                        direction       : _direction,
                        distance        : _distance,
                        distanceX       : _distance_x,
                        distanceY       : _distance_y,
                        angle           : _angle
                    };

                    // on the first time trigger the start event
                    if(_first) {
                        triggerEvent("dragstart", event_obj);

                        _first = false;
                    }

                    // normal slide event
                    triggerEvent("drag", event_obj);

                    cancelEvent(event);
                }
            },


            // transform gesture
            // fired on touchmove
            transform : function(event)
            {
                if(options.transform) {
                    var count = countFingers(event);
                    if (count !== 2) {
                        return false;
                    }

                    var rotation = calculateRotation(_pos.start, _pos.move);
                    var scale = calculateScale(_pos.start, _pos.move);

                    if (_gesture === 'transform' ||
                        Math.abs(1 - scale) > options.scale_treshold ||
                        Math.abs(rotation) > options.rotation_treshold) {

                        _gesture = 'transform';
                        _pos.center = {
                            x: ((_pos.move[0].x + _pos.move[1].x) / 2) - _offset.left,
                            y: ((_pos.move[0].y + _pos.move[1].y) / 2) - _offset.top
                        };

                        if(_first)
                            _pos.startCenter = _pos.center;

                        var _distance_x = _pos.center.x - _pos.startCenter.x;
                        var _distance_y = _pos.center.y - _pos.startCenter.y;
                        _distance = Math.sqrt(_distance_x*_distance_x + _distance_y*_distance_y);

                        var event_obj = {
                            originalEvent   : event,
                            position        : _pos.center,
                            scale           : scale,
                            rotation        : rotation,
                            distance        : _distance,
                            distanceX       : _distance_x,
                            distanceY       : _distance_y
                        };

                        // on the first time trigger the start event
                        if (_first) {
                            triggerEvent("transformstart", event_obj);
                            _first = false;
                        }

                        triggerEvent("transform", event_obj);

                        cancelEvent(event);

                        return true;
                    }
                }

                return false;
            },


            // tap and double tap gesture
            // fired on touchend
            tap : function(event)
            {
                // compare the kind of gesture by time
                var now = new Date().getTime();
                var touch_time = now - _touch_start_time;

                // dont fire when hold is fired
                if(options.hold && !(options.hold && options.hold_timeout > touch_time)) {
                    return;
                }

                // when previous event was tap and the tap was max_interval ms ago
                var is_double_tap = (function(){
                    if (_prev_tap_pos &&
                        options.tap_double &&
                        _prev_gesture == 'tap' &&
                        _pos.start &&
                        (_touch_start_time - _prev_tap_end_time) < options.tap_max_interval)
                    {
                        var x_distance = Math.abs(_prev_tap_pos[0].x - _pos.start[0].x);
                        var y_distance = Math.abs(_prev_tap_pos[0].y - _pos.start[0].y);
                        return (_prev_tap_pos && _pos.start && Math.max(x_distance, y_distance) < options.tap_double_distance);
                    }
                    return false;
                })();

                if(is_double_tap) {
                    _gesture = 'double_tap';
                    _prev_tap_end_time = null;

                    triggerEvent("doubletap", {
                        originalEvent   : event,
                        position        : _pos.start
                    });
                    cancelEvent(event);
                }

                // single tap is single touch
                else {
                    var x_distance = (_pos.move) ? Math.abs(_pos.move[0].x - _pos.start[0].x) : 0;
                    var y_distance =  (_pos.move) ? Math.abs(_pos.move[0].y - _pos.start[0].y) : 0;
                    _distance = Math.max(x_distance, y_distance);

                    if(_distance < options.tap_max_distance) {
                        _gesture = 'tap';
                        _prev_tap_end_time = now;
                        _prev_tap_pos = _pos.start;

                        if(options.tap) {
                            triggerEvent("tap", {
                                originalEvent   : event,
                                position        : _pos.start
                            });
                            cancelEvent(event);
                        }
                    }
                }
            }
        };


        function handleEvents(event)
        {
            var count;
            switch(event.type)
            {
                case 'mousedown':
                case 'touchstart':
                    count = countFingers(event);
                    _can_tap = count === 1;

                    //We were dragging and now we are zooming.
                    if (count === 2 && _gesture === "drag") {

                        //The user needs to have the dragend to be fired to ensure that
                        //there is proper cleanup from the drag and move onto transforming.
                        triggerEvent("dragend", {
                            originalEvent   : event,
                            direction       : _direction,
                            distance        : _distance,
                            angle           : _angle
                        });
                    }
                    _setup();

                    if(options.prevent_default) {
                        cancelEvent(event);
                    }
                    break;

                case 'mousemove':
                case 'touchmove':
                    count = countFingers(event);

                    //The user has gone from transforming to dragging.  The
                    //user needs to have the proper cleanup of the state and
                    //setup with the new "start" points.
                    if (!_mousedown && count === 1) {
                        return false;
                    } else if (!_mousedown && count === 2) {
                        _can_tap = false;

                        reset();
                        _setup();
                    }

                    _event_move = event;
                    _pos.move = getXYfromEvent(event);

                    if(!gestures.transform(event)) {
                        gestures.drag(event);
                    }
                    break;

                case 'mouseup':
                case 'mouseout':
                case 'touchcancel':
                case 'touchend':
                    var callReset = true;

                    _mousedown = false;
                    _event_end = event;

                    // swipe gesture
                    gestures.swipe(event);

                    // drag gesture
                    // dragstart is triggered, so dragend is possible
                    if(_gesture == 'drag') {
                        triggerEvent("dragend", {
                            originalEvent   : event,
                            direction       : _direction,
                            distance        : _distance,
                            angle           : _angle
                        });
                    }

                    // transform
                    // transformstart is triggered, so transformed is possible
                    else if(_gesture == 'transform') {
                        // define the transform distance
                        var _distance_x = _pos.center.x - _pos.startCenter.x;
                        var _distance_y = _pos.center.y - _pos.startCenter.y;

                        triggerEvent("transformend", {
                            originalEvent   : event,
                            position        : _pos.center,
                            scale           : calculateScale(_pos.start, _pos.move),
                            rotation        : calculateRotation(_pos.start, _pos.move),
                            distance        : _distance,
                            distanceX       : _distance_x,
                            distanceY       : _distance_y
                        });

                        //If the user goes from transformation to drag there needs to be a
                        //state reset so that way a dragstart/drag/dragend will be properly
                        //fired.
                        if (countFingers(event) === 1) {
                            reset();
                            _setup();
                            callReset = false;
                        }
                    } else if (_can_tap) {
                        gestures.tap(_event_start);
                    }

                    _prev_gesture = _gesture;

                    // trigger release event
                    // "release" by default doesn't return the co-ords where your
                    // finger was released. "position" will return "the last touched co-ords"

                    triggerEvent("release", {
                        originalEvent   : event,
                        gesture         : _gesture,
                        position        : _pos.move || _pos.start
                    });

                    // reset vars if this was not a transform->drag touch end operation.
                    if (callReset) {
                        reset();
                    }
                    break;
            } // end switch

            /**
             * Performs a blank setup.
             * @private
             */
            function _setup() {
                _pos.start = getXYfromEvent(event);
                _touch_start_time = new Date().getTime();
                _fingers = countFingers(event);
                _first = true;
                _event_start = event;

                // borrowed from jquery offset https://github.com/jquery/jquery/blob/master/src/offset.js
                var box = element.getBoundingClientRect();
                var clientTop  = element.clientTop  || document.body.clientTop  || 0;
                var clientLeft = element.clientLeft || document.body.clientLeft || 0;
                var scrollTop  = window.pageYOffset || element.scrollTop  || document.body.scrollTop;
                var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

                _offset = {
                    top: box.top + scrollTop - clientTop,
                    left: box.left + scrollLeft - clientLeft
                };

                _mousedown = true;

                // hold gesture
                gestures.hold(event);
            }
        }


        function handleMouseOut(event) {
            if(!isInsideHammer(element, event.relatedTarget)) {
                handleEvents(event);
            }
        }


        // bind events for touch devices
        // except for windows phone 7.5, it doesnt support touch events..!
        if(_has_touch) {
            addEvent(element, "touchstart touchmove touchend touchcancel", handleEvents);
        }
        // for non-touch
        else {
            addEvent(element, "mouseup mousedown mousemove", handleEvents);
            addEvent(element, "mouseout", handleMouseOut);
        }


        /**
         * find if element is (inside) given parent element
         * @param   object  element
         * @param   object  parent
         * @return  bool    inside
         */
        function isInsideHammer(parent, child) {
            // get related target for IE
            if(!child && window.event && window.event.toElement){
                child = window.event.toElement;
            }

            if(parent === child){
                return true;
            }

            // loop over parentNodes of child until we find hammer element
            if(child){
                var node = child.parentNode;
                while(node !== null){
                    if(node === parent){
                        return true;
                    }
                    node = node.parentNode;
                }
            }
            return false;
        }


        /**
         * merge 2 objects into a new object
         * @param   object  obj1
         * @param   object  obj2
         * @return  object  merged object
         */
        function mergeObject(obj1, obj2) {
            var output = {};

            if(!obj2) {
                return obj1;
            }

            for (var prop in obj1) {
                if (prop in obj2) {
                    output[prop] = obj2[prop];
                } else {
                    output[prop] = obj1[prop];
                }
            }
            return output;
        }


        /**
         * check if object is a function
         * @param   object  obj
         * @return  bool    is function
         */
        function isFunction( obj ){
            return Object.prototype.toString.call( obj ) == "[object Function]";
        }


        /**
         * attach event
         * @param   node    element
         * @param   string  types
         * @param   object  callback
         */
        function addEvent(element, types, callback) {
            types = types.split(" ");
            for(var t= 0,len=types.length; t<len; t++) {
                if(element.addEventListener){
                    element.addEventListener(types[t], callback, false);
                }
                else if(document.attachEvent){
                    element.attachEvent("on"+ types[t], callback);
                }
            }
        }


        /**
         * detach event
         * @param   node    element
         * @param   string  types
         * @param   object  callback
         */
        function removeEvent(element, types, callback) {
            types = types.split(" ");
            for(var t= 0,len=types.length; t<len; t++) {
                if(element.removeEventListener){
                    element.removeEventListener(types[t], callback, false);
                }
                else if(document.detachEvent){
                    element.detachEvent("on"+ types[t], callback);
                }
            }
        }
    }


    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            var hammer = new Hammer(this, options);

            var $this = $(this);
            $this.data('touch', hammer);

            var events = ['hold','tap','doubletap','transformstart','transform','transformend','dragstart','drag','dragend','swipe','release'];

            for(var e=0; e<events.length; e++) {
                hammer['on'+ events[e]] = (function(el, eventName) {
                    return function(ev) {
                        el.trigger($.Event(eventName, ev));
                    };
                })($this, events[e]);
            }
        });
    };

    return $.Touch = Hammer

});
// Ref:
// Uniform Resource Identifier (URI): Generic Syntax   http://tools.ietf.org/html/rfc3986
// http://blog.stevenlevithan.com/archives/parseuri
// http://nodejs.org/api/url.html

!(function (factory) {
    if (typeof define === 'function') {
        define('url/url',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'url';

    /*
     var parser = document.createElement('a');
     parser.href = 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash';
     parser.protocol; // => "http:"
     parser.hostname; // => "example.com"
     parser.port;     // => "3000"
     parser.pathname; // => "/pathname/"
     parser.search;   // => "?search=test"
     parser.hash;     // => "#hash"
     parser.host;     // => "example.com:3000"
     */
    $[pluginName] = function (href, parseQueryString){
        var type = $.type(href);

        if(type == 'string'){
            // work perfectly in all modern browsers (including IE6)
            // @see http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
            var a = document.createElement('a');
            a.href = href;
            return {
                href: href,
                protocol: a.protocol,
                hostname: a.hostname,
                port: a.port,
                search: a.search,
                hash: a.hash,
                pathname: a.pathname,
                path: a.pathname + a.search,
                query: (function(){

                    var qs = a.search.replace(/^\?/,'');
                    if(!parseQueryString){
                        return qs;
                    }else{
                        var ret = {},
                            seg = qs.split('&'),
                            len = seg.length, i = 0, s;
                        for (;i<len;i++) {
                            if (!seg[i]) { continue; }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    }

                })()
            };



        }

    };

});
!(function (factory) {
    if (typeof define === 'function') {
        define('uuid/uuid',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'uuid';

    // https://gist.github.com/1308368
    $[pluginName] = function(
        a,b                // placeholders
        ){
        for(               // loop :)
            b=a='';        // b - result , a - numeric variable
            a++<36;        //
            b+=a*51&52  // if "a" is not 9 or 14 or 19 or 24
                ?  //  return a random number or 4
                (
                    a^15      // if "a" is not 15
                        ?      // genetate a random number from 0 to 15
                        8^Math.random()*
                            (a^20?16:4)  // unless "a" is 20, in which case a random number from 8 to 11
                        :
                        4            //  otherwise 4
                    ).toString(16)
                :
                '-'            //  in other cases (if "a" is 9,14,19,24) insert "-"
            );
        return b
    }

});
!(function (factory) {
    if (typeof define === 'function') {
        define('validate/validate',['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    
    var pluginName = 'validate';


    /*! H5F - v1.0.0 - 2012-07-18
     * https://github.com/ryanseddon/H5F/
     * Copyright (c) 2012 Ryan Seddon; Licensed MIT */

    var field = document.createElement("input"),
        emailPatt = /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        urlPatt = /[a-z][\-\.+a-z]*:\/\//i,
        nodes = /^(input|select|textarea)$/i,
        isSubmit, usrPatt, curEvt, args, custMsg = "",
    // Methods
        setup, validation, validity, checkField, checkValidity, setCustomValidity, support, pattern, placeholder, range, required, valueMissing, listen, unlisten, preventActions, getTarget, addClass, removeClass, isHostMethod;

    setup = function(form,settings) {
        var isCollection = !form.nodeType || false;

        var opts = {
            validClass : "valid",
            invalidClass : "error",
            requiredClass : "required",
            placeholderClass : "placeholder"
        };

        if(typeof settings === "object") {
            for (var i in opts) {
                if(typeof settings[i] === "undefined") { settings[i] = opts[i]; }
            }
        }

        args = settings || opts;

        if(isCollection) {
            for(var k=0,len=form.length;k<len;k++) {
                validation(form[k]);
            }
        } else {
            validation(form);
        }
    };

    validation = function(form) {
        var f = form.elements,
            flen = f.length,
            isRequired, noValidate = !!(form.attributes["novalidate"]);

        listen(form,"invalid",checkField,true);
        listen(form,"blur",checkField,true);
        listen(form,"input",checkField,true);
        listen(form,"keyup",checkField,true);
        listen(form,"focus",checkField,true);
        listen(form,"change",checkField,true);

        listen(form,"submit",function(e){
            isSubmit = true;
            if(!noValidate && !form.checkValidity()) {
                preventActions(e);
            }
        },false);

        if(!support()) {
            form.checkValidity = function() { return checkValidity(form); };

            while(flen--) {
                isRequired = !!(f[flen].attributes["required"]);
                // Firefox includes fieldsets inside elements nodelist so we filter it out.
                if(f[flen].nodeName.toLowerCase() !== "fieldset") {
                    validity(f[flen]); // Add validity object to field
                }
            }
        }
    };
    validity = function(el) {
        var elem = el,
            missing = valueMissing(elem),
            attrs = {
                type: elem.getAttribute("type"),
                pattern: elem.getAttribute("pattern"),
                placeholder: elem.getAttribute("placeholder")
            },
            isType = /^(email|url)$/i,
            evt = /^(input|keyup)$/i,
            fType = ((isType.test(attrs.type)) ? attrs.type : ((attrs.pattern) ? attrs.pattern : false)),
            patt = pattern(elem,fType),
            step = range(elem,"step"),
            min = range(elem,"min"),
            max = range(elem,"max"),
            customError = (custMsg !== "");

        elem.checkValidity = function() { return checkValidity.call(this,elem); };
        elem.setCustomValidity = function(msg) { setCustomValidity.call(elem,msg); };
        elem.validationMessage = custMsg;

        elem.validity = {
            valueMissing: missing,
            patternMismatch: patt,
            rangeUnderflow: min,
            rangeOverflow: max,
            stepMismatch: step,
            customError: customError,
            valid: (!missing && !patt && !step && !min && !max && !customError)
        };

        if(attrs.placeholder && !evt.test(curEvt)) { placeholder(elem); }
    };
    checkField = function (e) {
        var el = getTarget(e) || e, // checkValidity method passes element not event
            events = /^(input|keyup|focusin|focus|change)$/i,
            ignoredTypes = /^(submit|image|button|reset)$/i,
            specialTypes = /^(checkbox|radio)$/i,
            checkForm = true;

        if(nodes.test(el.nodeName) && !(ignoredTypes.test(el.type) || ignoredTypes.test(el.nodeName))) {
            curEvt = e.type;

            if(!support()) {
                validity(el);
            }

            if(el.validity.valid && (el.value !== "" || specialTypes.test(el.type)) || (el.value !== el.getAttribute("placeholder") && el.validity.valid)) {
                removeClass(el,[args.invalidClass,args.requiredClass]);
                addClass(el,args.validClass);
            } else if(!events.test(curEvt)) {
                if(el.validity.valueMissing) {
                    removeClass(el,[args.invalidClass,args.validClass]);
                    addClass(el,args.requiredClass);
                } else if(!el.validity.valid) {
                    removeClass(el,[args.validClass,args.requiredClass]);
                    addClass(el,args.invalidClass);
                }
            } else if(el.validity.valueMissing) {
                removeClass(el,[args.requiredClass,args.invalidClass,args.validClass]);
            }
            if(curEvt === "input" && checkForm) {
                // If input is triggered remove the keyup event
                unlisten(el.form,"keyup",checkField,true);
                checkForm = false;
            }
        }
    };
    checkValidity = function (el) {
        var f, ff, isRequired, hasPattern, invalid = false;

        if(el.nodeName.toLowerCase() === "form") {
            f = el.elements;

            for(var i = 0,len = f.length;i < len;i++) {
                ff = f[i];

                isRequired = !!(ff.attributes["required"]);
                hasPattern = !!(ff.attributes["pattern"]);

                if(ff.nodeName.toLowerCase() !== "fieldset" && (isRequired || hasPattern && isRequired)) {
                    checkField(ff);
                    if(!ff.validity.valid && !invalid) {
                        if(isSubmit) { // If it's not a submit event the field shouldn't be focused
                            ff.focus();
                        }
                        invalid = true;
                    }
                }
            }
            return !invalid;
        } else {
            checkField(el);
            return el.validity.valid;
        }
    };
    setCustomValidity = function (msg) {
        var el = this;
        custMsg = msg;

        el.validationMessage = custMsg;
    };

    support = function() {
        return (isHostMethod(field,"validity") && isHostMethod(field,"checkValidity"));
    };

    // Create helper methods to emulate attributes in older browsers
    pattern = function(el, type) {
        if(type === "email") {
            return !emailPatt.test(el.value);
        } else if(type === "url") {
            return !urlPatt.test(el.value);
        } else if(!type) {
            return false;
        } else {
            var placeholder = el.getAttribute("placeholder"),
                val = el.value;

            usrPatt = new RegExp('^(?:' + type + ')$');

            if(val === placeholder) {
                return true;
            } else if(val === "") {
                return false;
            } else {
                return !usrPatt.test(el.value);
            }
        }
    };
    placeholder = function(el) {
        var attrs = { placeholder: el.getAttribute("placeholder") },
            focus = /^(focus|focusin|submit)$/i,
            node = /^(input|textarea)$/i,
            ignoredType = /^password$/i,
            isNative = !!("placeholder" in field);

        if(!isNative && node.test(el.nodeName) && !ignoredType.test(el.type)) {
            if(el.value === "" && !focus.test(curEvt)) {
                el.value = attrs.placeholder;
                listen(el.form,'submit', function () {
                    curEvt = 'submit';
                    placeholder(el);
                }, true);
                addClass(el,args.placeholderClass);
            } else if(el.value === attrs.placeholder && focus.test(curEvt)) {
                el.value = "";
                removeClass(el,args.placeholderClass);
            }
        }
    };
    range = function(el,type) {
        // Emulate min, max and step
        var min = parseInt(el.getAttribute("min"),10) || 0,
            max = parseInt(el.getAttribute("max"),10) || false,
            step = parseInt(el.getAttribute("step"),10) || 1,
            val = parseInt(el.value,10),
            mismatch = (val-min)%step;

        if(!valueMissing(el) && !isNaN(val)) {
            if(type === "step") {
                return (el.getAttribute("step")) ? (mismatch !== 0) : false;
            } else if(type === "min") {
                return (el.getAttribute("min")) ? (val < min) : false;
            } else if(type === "max") {
                return (el.getAttribute("max")) ? (val > max) : false;
            }
        } else if(el.getAttribute("type") === "number") {
            return true;
        } else {
            return false;
        }
    };
    required = function(el) {
        var required = !!(el.attributes["required"]);

        return (required) ? valueMissing(el) : false;
    };
    valueMissing = function(el) {
        var placeholder = el.getAttribute("placeholder"),
            isRequired = !!(el.attributes["required"]);
        return !!(isRequired && (el.value === "" || el.value === placeholder));
    };

    /* Util methods */
    listen = function (node,type,fn,capture) {
        if(isHostMethod(window,"addEventListener")) {
            /* FF & Other Browsers */
            node.addEventListener( type, fn, capture );
        } else if(isHostMethod(window,"attachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            if(type === "blur") {
                type = "focusout";
            } else if(type === "focus") {
                type = "focusin";
            }
            node.attachEvent( "on" + type, fn );
        }
    };
    unlisten = function (node,type,fn,capture) {
        if(isHostMethod(window,"removeEventListener")) {
            /* FF & Other Browsers */
            node.removeEventListener( type, fn, capture );
        } else if(isHostMethod(window,"detachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            node.detachEvent( "on" + type, fn );
        }
    };
    preventActions = function (evt) {
        evt = evt || window.event;

        if(evt.stopPropagation && evt.preventDefault) {
            evt.stopPropagation();
            evt.preventDefault();
        } else {
            evt.cancelBubble = true;
            evt.returnValue = false;
        }
    };
    getTarget = function (evt) {
        evt = evt || window.event;
        return evt.target || evt.srcElement;
    };
    addClass = function (e,c) {
        var re;
        if (!e.className) {
            e.className = c;
        }
        else {
            re = new RegExp('(^|\\s)' + c + '(\\s|$)');
            if (!re.test(e.className)) { e.className += ' ' + c; }
        }
    };
    removeClass = function (e,c) {
        var re, m, arr = (typeof c === "object") ? c.length : 1, len = arr;
        if (e.className) {
            if (e.className === c) {
                e.className = '';
            } else {
                while(arr--) {
                    re = new RegExp('(^|\\s)' + ((len > 1) ? c[arr] : c) + '(\\s|$)');
                    m = e.className.match(re);
                    if (m && m.length === 3) { e.className = e.className.replace(re, (m[1] && m[2])?' ':''); }
                }
            }
        }
    };
    isHostMethod = function(o, m) {
        var t = typeof o[m], reFeaturedMethod = new RegExp('^function|object$', 'i');
        return !!((reFeaturedMethod.test(t) && o[m]) || t === 'unknown');
    };

    // Since all methods are only used internally no need to expose globally
    return $[pluginName] = {
        setup: setup
    };


});
!(function (factory) {
    if (typeof define === 'function') {
        define('module.js',[
            './$',
            './class/class',
            './cookie/cookie',
            './cookie/remove',
            './cors/img',
            './cors/xdr',
            './history/history',
            './json/json',
            './jsonpi/jsonpi',
            './key/key',
            './memoize/memoize',
            './mousewheel/mousewheel',
            './object/keys',
            './postmessage/postmessage',
            './route/route',
            './storage/storage',
            './string/color',
            './string/format',
            './string/trim',
            './template/template',
            './touch/touch',
            './url/url',
            './uuid/uuid',
            './validate/validate',
            './uuid/uuid'
        ], factory);
    } else {
        factory($);
    }
})(function ($) {

});