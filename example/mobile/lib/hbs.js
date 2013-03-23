define(['jquery', 'handlebars'], function ($) {
    var ajaxGet = function(url, callback) {
        $.ajax({
            url: url,
            dataType: 'text',
            success: function(text) {
                callback(Handlebars.compile(text));
            }
        });
    };

    var nodeGet = function(url, callback) {
        var fs = require.nodeRequire('fs'),
            path = require.nodeRequire('path'),
            baseUrl = require.s.contexts._.config.baseUrl;
        
        if (url.indexOf('/') !== 0) {
            url = path.join(baseUrl, url); 
        }

        callback(fs.readFileSync(url, 'utf8'));
    };

    var get;

    if (typeof window !== "undefined") {
        get = ajaxGet;
    } else {
        get = nodeGet;
    }

    return {
        version: '0.0.1',

        load: function (name, req, onLoad, config) {
           get(name, onLoad);
        },

        write: function (pluginName, moduleName, out) {
            var Handlebars = require.nodeRequire('handlebars');

            get(moduleName, function(content) {
                var func = Handlebars.precompile(content);

                out("define('" + pluginName + "!" + moduleName  +
                    "', ['handlebars'], function() { return Handlebars.template(" + func + "); });\n");
            });
        }
    };
});
