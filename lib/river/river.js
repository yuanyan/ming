/* Copyright (c) 1998 - 2013 Tencent Research. All Rights Reserved. */

;(function() {
    // shortcut for internal namespace
    var toString = Object.prototype.toString;
    var isFunction = function(obj){return !!(obj && obj.constructor && obj.call && obj.apply)};
    var isArray = Array.isArray || function(obj){return '[object Array]' === toString.call(obj)};

    var doc = document;
    var head = doc.head ||
        doc.getElementsByTagName('head')[0] ||
        doc.documentElement;

    var baseElement = head.getElementsByTagName('base')[0];

    var cachedModules = {};
    var fetchingList = {};
    var fetchedList = {};
    var callbackList = {};

    var DIRNAME_RE = /.*(?=\/.*$)/;
    var FILE_EXT_RE = /\.(?:js)$/;
    var ROOT_RE = /^(.*?\w)(?:\/|$)/;
    var STATUS = {
        'FETCHING':1, // The module file is fetching now.
        'FETCHED':2, // The module file has been fetched.
        'SAVED':3 // The module info has been saved.
    };

    // Static script
    var scripts = document.getElementsByTagName('script'),
        loaderScript = scripts[scripts.length - 1],
        loaderSrc = (loaderScript && getScriptAbsoluteSrc(loaderScript)); // When vm.js is inline, set base to pageUri.

    var base = dirname(loaderSrc);
    var charset = 'utf-8';

    /**
     * Extracts the directory portion of a path.
     * dirname('a/b/c.js') ==> 'a/b/'
     * dirname('d.js') ==> './'
     * @see http://jsperf.com/regex-vs-split/2
     */
    function dirname(path) {
        var s = path.match(DIRNAME_RE);
        return (s ? s[0] : '.') + '/'
    }

    function resolve(id, refUri) {

        if (!id) return '';

        //refUri || (refUri = pageUri);
        refUri || (refUri = base);

        var ret;

        // absolute id
        if ( id.indexOf('://') > 0 || id.indexOf('//') === 0 ) {
            ret = id
        }
        // relative id
        else if ( id.indexOf('./') === 0 || id.indexOf('../') === 0 ) {
            // Converts './a' to 'a', to avoid unnecessary loop in realpath.
            if (id.indexOf('./') === 0) {
                id = id.substring(2)
            }
            ret = dirname(refUri) + id
        }
        // root id
        else if ( id.charAt(0) === '/' && id.charAt(1) !== '/' ) {
            ret = refUri.match(ROOT_RE)[1] + id
        }
        // top-level id
        // var c = id.charAt(0)
        // return id.indexOf('://') === -1 && c !== '.' && c !== '/'
        else {

            if( base.charAt(base.length - 1) !== '/' ){
                base += '/'
            }

            ret = base + id
        }

        if (!FILE_EXT_RE.test(ret)) {
            ret += '.js'
        }

        return ret
    }


    function fetchScript(url, charset) {

        var node = document.createElement('script');
        charset && (node.charset = charset);

        node.async = 'async';
        node.src = url;

        // ref: #185 & http://dev.jquery.com/ticket/2709
        baseElement ?
            head.insertBefore(node, baseElement) :
            head.appendChild(node);

    }

    function getScriptAbsoluteSrc(node) {
        return node.hasAttribute ? // non-IE6/7
            node.src :
            // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            node.getAttribute('src', 4)
    }

    function Module(uri, status) {
        this.uri = uri;
        this.status = status || 0;
    }

    function save(uri, meta) {
        var module = cachedModules[uri];

        // Don't override already saved module
        if (module.status < STATUS.SAVED) {
            // Lets anonymous module id equal to its uri
            module.id = meta.id || uri;
            module.dependencies = meta.dependencies;
            var factory = module.factory = meta.factory;
            // TODO 异步化模块的 依赖参数
            var args = [];

            module.exports = {};
            if (isFunction(factory)) {

                var ret = factory.apply(null, args);
                if (ret !== undefined) {
                    module.exports = ret
                }

            }
            else if (factory !== undefined) {
                module.exports = factory
            }

            // Updates module status
            module.status = STATUS.SAVED
        }


        return module
    }

    // id 为必须的参数
    this.define = function(id, deps, factory){

        var argsLength = arguments.length;

        // define(factory)
        if (argsLength === 1) {
            factory = id;
            id = undefined
        }
        // define(id || deps, factory)
        else if (argsLength === 2) {
            factory = deps;
            deps = undefined;

            // define(deps, factory)
            if (isArray(id)) {
                deps = id;
                id = undefined
            }
        }

        if (id) {

            // 结合实际场景暂不做 异步模块 的依赖检测，即异步模块是没有依赖项的实体
            var meta = { id:id, dependencies:deps, factory:factory };

            var resolvedUri = resolve(id);
            var module = save(resolvedUri, meta);

            if (resolvedUri) {

                fetchedList[resolvedUri] = true;

                // Clears
                if (fetchingList[resolvedUri]) {
                    delete fetchingList[resolvedUri]
                }

                // Calls callbackList
                if (callbackList[resolvedUri]) {
                    callbackList[resolvedUri].forEach(function(fn) {
                        // TODO 支持多个异步化加载的模式，如 require([],callback)
                        fn.apply(null, [module.exports]);
                    });
                    delete callbackList[resolvedUri];
                }

            }

        }
        else {
            // vm 场景下不允许匿名的异步化模块
            throw new Error;
        }
    };

    // Q.require('updater', function(updater){console.log(updater)});
    this.require = function (id, callback){

        var requestUri = resolve(id);

        if (fetchedList[requestUri]) {

            var child = cachedModules[requestUri];

            callback && callback(child.exports);

            return child.exports;
        }

        if (fetchingList[requestUri]) {
            callbackList[requestUri].push(callback);
            return
        }

        fetchingList[requestUri] = true;
        callbackList[requestUri] = [callback];

        // require 时初始模块为 Fetching 状态
        cachedModules[requestUri] = new Module(requestUri, STATUS.FETCHING);

        // Fetches it
        fetchScript(requestUri, charset)
    };

})();
