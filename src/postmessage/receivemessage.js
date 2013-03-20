!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'receiveMessage';

   // A few vars used in non-awesome browsers.
    var interval_id,
        last_hash,

    // A var used in awesome browsers.
        rm_callback,

    // A few convenient shortcuts.
        FALSE = !1,

    // Reused internal strings.
        postMessage = 'postMessage',
        addEventListener = 'addEventListener';

    // I couldn't get window.postMessage to actually work in Opera 9.64!
    //  has_postMessage = window[postMessage] && !$.browser.opera;
    $.support.postMessage = !!window[postMessage];


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

    return $[pluginName] = function( callback, source_origin, delay ) {
        if ( $.support.postMessage ) {
            // Since the browser supports window.postMessage, the callback will be
            // bound to the actual event associated with window.postMessage.

            if ( callback ) {
                // Unbind an existing callback if it exists.
                rm_callback && $.receiveMessage();

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
})