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


    var REG_URI =  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    var REG_QUERY  =  /(?:^|&)([^&=]*)=?([^&]*)/g;
    var HOSTNAME = 'hostname';
    var PORT = 'port';
    var HOST = 'host';  // full lowercased host portion of the URL, including port information: 'host.com:8080'
    var ANCHOR =  'anchor';
    var HASH = 'hash';
    var QUERY = 'query'; // querystring-parsed object
    var QUERYSTRING = 'querystring';
    var SEARCH = 'search';
    var PROTOCOL = 'protocol';
    var SCHEME = 'scheme';
    var PARTS =  ["href",SCHEME,"authority","auth","user","password",HOSTNAME, PORT,"relative","path","directory","file",QUERYSTRING, ANCHOR];

    return $[pluginName] =  function (href) {
        var	match = REG_URI.exec(href),
            uri = {},
            i = 14;

        while (i--) uri[PARTS[i]] = match[i] || "";

        uri[QUERY] = {};
        uri[QUERYSTRING].replace(REG_QUERY, function ($0, $1, $2) {
            if ($1) uri[QUERY][$1] = $2;
        });

        uri[HOST] = uri[PORT] ? (uri[HOSTNAME] + ':' + uri[PORT]) : '';
        uri[HASH] = uri[ANCHOR] ? '#' + uri[ANCHOR] : '';
        uri[SEARCH] = uri[QUERYSTRING] ? '?' + uri[QUERYSTRING] : '';
        uri[PROTOCOL] = uri[SCHEME] ? uri[SCHEME] + ':' : '' ;
        return uri;
    }


})