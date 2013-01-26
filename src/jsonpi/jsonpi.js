!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

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

})