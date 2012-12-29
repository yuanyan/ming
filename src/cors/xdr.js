!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    $.ajaxSettings.xdr = function() {
        var xhr2;
        if(window.XMLHttpRequest && 'withCredentials' in (xhr2 = new XMLHttpRequest())){ //iE10+
            return xhr2;
        }else if(window.XDomainRequest){  //IE8+
            return new window.XDomainRequest();
        }

    };

    $.support.cors =  !!$.ajaxSettings.xdr();

    // Create transport if the browser can provide an xdr (and fails $.support.cors)
    if ($.support.cors) {

        $.ajaxTransport(function(options, originalOptions, jqXHR) {
            var xdr;

            return {
                send: function(headers, complete) {
                    xdr = options.xdr();

                    // XDR does not support custom headers

                    // Seems that xdr requests can get hung up indefinitely without a timeout.
                    xdr.timeout = options.timeout || 10000;

                    // IE9 has a bug that requires the xdr.onprogress method to be set. We'll just set them all, just in case.
                    // (http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e)
                    xdr.onload = xdr.onerror = xdr.ontimeout = xdr.onprogress = $.noop;

                    xdr.onload = function() {
                        var headers = {
                            'Content-Type': xdr.contentType
                        };

                        complete(200, 'OK', { text: xdr.responseText }, headers);
                    };

                    if (options.xhrFields) {
                        if (options.xhrFields.progress) xhr.onprogress = options.xhrFields.progress;
                        if (options.xhrFields.error) xhr.onerror = options.xhrFields.error;
                        if (options.xhrFields.timeout) xhr.ontimeout = options.xhrFields.timeout;
                        // XDR does not support withCredentials
                    } else {
                        xdr.onprogress = function() {
                            //console.log("XDR progress");
                        };
                        xdr.onerror = function() {
                            //console.log("XDR error");
                            complete(404, "Not Found");
                        };
                        xdr.ontimeout = function() {
                            //console.log("XDR timeout");
                            complete(408, "Request Timeout");
                        };
                    }

                    // // TODO: If you're getting "Aborted" requests in IE9, try uncommenting this block.
                    // // A few people reported 'jQuery.noop' wasn't good enough, but I can't figure out why.
                    // xdr.onprogress = function() {
                    //     console.log("XDR progress");
                    // };

                    xdr.open(options.type, options.url);

                    if (options.hasContent && options.data) {
                        xdr.send(options.data);
                    } else {
                        xdr.send();
                    }
                },

                abort: function () {
                    //console.log("XDR abort");
                    return xdr && xdr.abort();
                }
            };
        });
    }

})