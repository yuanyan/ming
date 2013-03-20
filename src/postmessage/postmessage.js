!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'postMessage';

   // A few vars used in non-awesome browsers.
    var cache_bust = 1,
    // A few convenient shortcuts.
    // Reused internal strings.
        postMessage = 'postMessage',
        addEventListener = 'addEventListener';
    // I couldn't get window.postMessage to actually work in Opera 9.64!
    //  has_postMessage = window[postMessage] && !$.browser.opera;

    $.support.postMessage = !!window[postMessage];

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

    return $[pluginName] = function( message, target_url, target ) {
        if ( !target_url ) { return; }

        // Serialize the message if not a string. Note that this is the only real
        // jQuery dependency for this script. If removed, this script could be
        // written as very basic JavaScript.
        message =  ''+message;

        // Default to parent if unspecified.
        target = target || parent;

        if ( $.support.postMessage ) {
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

})