/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define(['module'], function (module) {

    'use strict';

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    var templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g,
        include      : /<%@([\s\S]+?)%>/g
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

    // template include cache
    var partials = {};

    var templating = function(text, data, settings) {

        var render;
        settings = templateSettings;

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.include || noMatch).source,
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source // evaluate 的正则需放置在最后
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, include, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });

            if (include) {
                // default include format: <%@ header.html:context %>
                var includes = include.trim().split(":");
                var context = includes[1] || '';
                // partials must be ready before
                source += "'+\n(" + partials[includes[0]] + ")("+ context +")+\n'";
            }
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
            render = new Function(settings.variable || 'obj', '$', source); // _ 改造为 $
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


    var tmpl, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    tmpl = {
        version: '2.0.5+',

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext
         *
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a tmpl resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = tmpl.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, content, onLoad /*可选*/) {
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }

            var precompile = templating(content);

            // 兼容同步异步两种调用方式
            onLoad && onLoad(precompile);
            return precompile;
        },

        load: function (name, require, onLoad, config) {
            //Name has format: some.module.html

            // Do not bother with the work if a build and tmpl will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = tmpl.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = require.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         tmpl.useXhr;

            // 同源检测
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                tmpl.get(url, function (content) {

                    var matches, originIncludes = [], includes = [];
                    while ((matches = templateSettings.include.exec(content)) !== null){
                        var include = require.toUrl( matches[1].trim() ); // TODO 兼容 trim 方法, 考虑是否容错检测，如 <%@ %> 为空的情况等
                        originIncludes.push(include);
                        includes.push('tmpl!' + include);
                    }

                    if(includes[0]){
                        require(includes, function(){
                            for(var i= 0,l=arguments.length; i<l; i++){
                                if(!arguments[i]){
                                    console.log(url, !hasLocation, useXhr(url, defaultProtocol, defaultHostName, defaultPort), includes, arguments)
                                }

                                partials[originIncludes[i]] = arguments[i].source;
                            }
                            tmpl.finishLoad(name, content, onLoad);
                        });
                    }else{
                        tmpl.finishLoad(name, content, onLoad);
                    }

                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                require([nonStripName], function (content) {
                    tmpl.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    content, onLoad);
                });
            }
        },

        // for r.js
        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = buildMap[moduleName];
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return " +
                                   templating(content).source +
                               ";});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = tmpl.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                // Use a '.js' file name so that it indicates it is a
                // script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            // Leverage own load() method to load plugin value, but only
            // write out values that do not have the strip argument,
            // to avoid any potential issues with ! in file names.
            tmpl.load(nonStripName, req, function (value) {
                // Use own write() method to construct full module value.
                // But need to create shell that translates writeFile's
                // write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                tmpl.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    // node
    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        // Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        tmpl.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            // Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback && callback(file);
            return file;
        };

    // browser
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            tmpl.createXhr())) {
        tmpl.get = function (url, callback, errback, headers) {
            var xhr = tmpl.createXhr(), header;

            // default synchronous AJAX
            var async = !!masterConfig.async;
            xhr.open('GET', url, async);

            // Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            // Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            async && (xhr.onreadystatechange = function (evt) {
                var status, err;
                // Do not explicitly handle errors, those should be
                // visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            });

            xhr.send(null);

            !async && callback && callback(xhr.responseText);

            var status = xhr.status;
            if (status > 399 && status < 600) {
                throw new Error(url + ' HTTP status: ' + status);
            }else{
                return xhr.responseText
            }

        };
    }
    return tmpl;
});
