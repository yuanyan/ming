// Ref:
// Uniform Resource Identifier (URI): Generic Syntax   http://tools.ietf.org/html/rfc3986
// http://blog.stevenlevithan.com/archives/parseuri
// http://nodejs.org/api/url.html

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

})