!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

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

})