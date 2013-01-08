!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
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
    $[pluginName] = function (href){
        var type = $.type(href);

        if(type == 'string'){
            // work perfectly in all modern browsers (including IE6)
            // @see http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
            var parser = document.createElement('a');
            parser.href = href;
            return parser;

        }else if(type == 'object'){
            // TODO
            var parts = [href['protocol'],href['hostname'],href['port'],href['pathname'],href['search'],href['hash']];
            parts.join('');

        }

    };

    // Uniform Resource Identifier (URI): Generic Syntax   http://tools.ietf.org/html/rfc3986
    // http://blog.stevenlevithan.com/archives/parseuri
    // http://nodejs.org/api/url.html

})