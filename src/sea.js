// copyright https://github.com/seajs/seajs

this.seajs = {
     _util:  {}
    ,_config: {charset:"utf-8"}
}

;(function (util, config) {

    var toString = Object.prototype.toString

    util.isString = function(val) {
        return toString.call(val) === '[object String]'
    }

    util.isFunction = function(val) {
        return toString.call(val) === '[object Function]'
    }

    util.unique = function(arr) {
        var o = {}

        arr.forEach(function(item) {
            o[item] = 1
        });

        return Object.keys(o)
    }

    util.log = function(){
        if (typeof console === 'undefined' || !config.debug) return
        // debug in chrome, ignore ie
        console.log.apply(console, arguments)
    }


})(seajs._util, seajs._config)


;(function (util, config) {

    var doc = document
    var head = doc.head ||
        doc.getElementsByTagName('head')[0] ||
        doc.documentElement

    var baseElement = head.getElementsByTagName('base')[0]

    var IS_CSS_RE = /\.css(?:\?|$)/i
    var READY_STATE_RE = /loaded|complete|undefined/

    var currentlyAddingScript
    var interactiveScript


    util.fetch = function (url, callback, charset) {
        var isCSS = IS_CSS_RE.test(url)
        var node = document.createElement(isCSS ? 'link' : 'script')

        if (charset) {
            var cs = util.isFunction(charset) ? charset(url) : charset
            cs && (node.charset = cs)
        }

        assetOnload(node, callback || noop)

        if (isCSS) {
            node.rel = 'stylesheet'
            node.href = url
        } else {
            node.async = 'async'
            node.src = url
        }

        // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
        // the end of the insertBefore execution, so use `currentlyAddingScript`
        // to hold current node, for deriving url in `define`.
        currentlyAddingScript = node

        // ref: #185 & http://dev.jquery.com/ticket/2709
        baseElement ?
            head.insertBefore(node, baseElement) :
            head.appendChild(node)

        currentlyAddingScript = null
    }

    function assetOnload(node, callback) {
        if (node.nodeName === 'SCRIPT') {
            scriptOnload(node, callback)
        } else {
            styleOnload(node, callback)
        }
    }

    function scriptOnload(node, callback) {

        node.onload = node.onerror = node.onreadystatechange = function () {
            if (READY_STATE_RE.test(node.readyState)) {

                // Ensure only run once and handle memory leak in IE
                node.onload = node.onerror = node.onreadystatechange = null

                // Remove the script to reduce memory leak
                if (node.parentNode && !config.debug) {
                    head.removeChild(node)
                }

                // Dereference the node
                node = undefined

                callback()
            }
        }

    }

    function styleOnload(node, callback) {

        // for Old WebKit and Old Firefox
        if (isOldWebKit || isOldFirefox) {
            util.log('Start poll to fetch css')

            setTimeout(function () {
                poll(node, callback)
            }, 1) // Begin after node insertion
        }
        else {
            node.onload = node.onerror = function () {
                node.onload = node.onerror = null
                node = undefined
                callback()
            }
        }

    }

    function poll(node, callback) {
        var isLoaded

        // for WebKit < 536
        if (isOldWebKit) {
            if (node['sheet']) {
                isLoaded = true
            }
        }
        // for Firefox < 9.0
        else if (node['sheet']) {
            try {
                if (node['sheet'].cssRules) {
                    isLoaded = true
                }
            } catch (ex) {
                // The value of `ex.name` is changed from
                // 'NS_ERROR_DOM_SECURITY_ERR' to 'SecurityError' since Firefox 13.0
                // But Firefox is less than 9.0 in here, So it is ok to just rely on
                // 'NS_ERROR_DOM_SECURITY_ERR'
                if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
                    isLoaded = true
                }
            }
        }

        setTimeout(function () {
            if (isLoaded) {
                // Place callback in here due to giving time for style rendering.
                callback()
            } else {
                poll(node, callback)
            }
        }, 1)
    }

    function noop() {
    }


    util.getCurrentScript = function() {
        if (currentlyAddingScript) {
            return currentlyAddingScript
        }

        // For IE6-9 browsers, the script onload event may not fire right
        // after the the script is evaluated. Kris Zyp found that it
        // could query the script nodes and the one that is in "interactive"
        // mode indicates the current script.
        // Ref: http://goo.gl/JHfFW
        if (interactiveScript &&
            interactiveScript.readyState === 'interactive') {
            return interactiveScript
        }

        var scripts = head.getElementsByTagName('script')

        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i]
            if (script.readyState === 'interactive') {
                interactiveScript = script
                return script
            }
        }
    }

    util.getScriptAbsoluteSrc = function (node) {
        return node.hasAttribute ? // non-IE6/7
            node.src :
            // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            node.getAttribute('src', 4)
    }


    util.importStyle = function (cssText, id) {
        // Don't add multi times
        if (id && doc.getElementById(id)) return

        var element = doc.createElement('style')
        id && (element.id = id)

        // Adds to DOM first to avoid the css hack invalid
        head.appendChild(element)

        // IE
        if (element.styleSheet) {
            element.styleSheet.cssText = cssText
        }
        // W3C
        else {
            element.appendChild(doc.createTextNode(cssText))
        }
    }


    var UA = navigator.userAgent

    // `onload` event is supported in WebKit since 535.23
    // Ref:
    //  - https://bugs.webkit.org/show_activity.cgi?id=38995
    var isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536

    // `onload/onerror` event is supported since Firefox 9.0
    // Ref:
    //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
    //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
    var isOldFirefox = UA.indexOf('Firefox') > 0 &&
        !('onload' in document.createElement('link'))


    /**
     * References:
     *  - http://unixpapa.com/js/dyna.html
     *  - ../test/research/load-js-css/test.html
     *  - ../test/issues/load-css/test.html
     *  - http://www.blaze.io/technical/ies-premature-execution-problem/
     */

})(seajs._util, seajs._config, this)

;(function (util, config, global) {

    var ROOT_RE = /^(.*?\w)(?:\/|$)/
    var FILE_EXT_RE = /\.(?:css|js)$/
    var DIRNAME_RE = /.*(?=\/.*$)/
    var REQUIRE_RE = /(?:^|[^.$])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g

    var cachedModules = {}
    var fetchingList = {}
    var fetchedList = {}
    var callbackList = {}
    var anonymousModuleMeta = null

    var STATUS = {
        'FETCHING':1, // The module file is fetching now.
        'FETCHED':2, // The module file has been fetched.
        'SAVED':3, // The module info has been saved.
        'READY':4, // All dependencies and self are ready to compile.
        'COMPILING':5, // The module is in compiling now.
        'COMPILED':6   // The module is compiled and module.exports is available.
    }

    var loc = location
    var pageUri = loc.protocol + '//' + loc.host +
        normalizePathname(loc.pathname)

    // local file in IE: C:\path\to\xx.js
    if (pageUri.indexOf('\\') > 0) {
        pageUri = pageUri.replace(/\\/g, '/')
    }

    // Static script
    var scripts = document.getElementsByTagName('script')
    loaderScript = scripts[scripts.length - 1]

    var loaderSrc = (loaderScript && util.getScriptAbsoluteSrc(loaderScript)) ||
        pageUri // When sea.js is inline, set base to pageUri.

    var base = dirname(loaderSrc)
    config.base = base

    function parseDependencies (code) {
        // Parse these `requires`:
        //   var a = require('a');
        //   someMethod(require('b'));
        //   require('c');
        //   ...
        // Doesn't parse:
        //   someInstance.require(...);
        var ret = [], match

        code = removeComments(code)
        REQUIRE_RE.lastIndex = 0

        while ((match = REQUIRE_RE.exec(code))) {
            if (match[2]) {
                ret.push(match[2])
            }
        }

        return util.unique(ret)
    }

    // See: research/remove-comments-safely
    function removeComments(code) {
        return code
            .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/mg, '')// block comments
            .replace(/^\s*\/\/.*$/mg, '') // line comments
    }

    /**
     * Extracts the directory portion of a path.
     * dirname('a/b/c.js') ==> 'a/b/'
     * dirname('d.js') ==> './'
     * @see http://jsperf.com/regex-vs-split/2
     */
    function dirname(path) {
        var s = path.match(DIRNAME_RE)
        return (s ? s[0] : '.') + '/'
    }

    /**
     * Normalizes pathname to start with '/'
     * Ref: https://groups.google.com/forum/#!topic/seajs/9R29Inqk1UU
     */
    function normalizePathname(pathname) {
        // only ie  move to sea.ie.js?
        if (pathname.charAt(0) !== '/') {
            pathname = '/' + pathname
        }
        return pathname
    }


    function resolve(id, refUri) {

        if (!id) return ''

        if (Array.isArray(id)) {
           return  id.map(function(id) {
               return resolve(id, refUri)
           })
        }

        refUri || (refUri = pageUri)

        var ret

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

            var base = config.base
            if( base.charAt(base.length - 1) !== '/' ){
                config.base += '/'
            }

            ret = base + id
        }

       if (!FILE_EXT_RE.test(ret)) {
           ret += '.js'
       }

        return ret
    }


    function fetch(uri, callback) {
        var requestUri = uri;

        if (fetchedList[requestUri]) {
            callback()
            return
        }

        if (fetchingList[requestUri]) {
            callbackList[requestUri].push(callback)
            return
        }

        fetchingList[requestUri] = true
        callbackList[requestUri] = [callback]

        // Fetches it
        util.fetch(
            requestUri,

            function() {
                fetchedList[requestUri] = true

                // Updates module status
                var module = cachedModules[uri]
                if (module.status === STATUS.FETCHING) {
                    module.status = STATUS.FETCHED
                }

                // Saves anonymous module meta data
                if (anonymousModuleMeta) {
                    save(uri, anonymousModuleMeta)
                    anonymousModuleMeta = null
                }

                // Clears
                if (fetchingList[requestUri]) {
                    delete fetchingList[requestUri]
                }

                // Calls callbackList
                if (callbackList[requestUri]) {
                    callbackList[requestUri].forEach(function(fn) {
                        fn()
                    })
                    delete callbackList[requestUri]
                }

            },

            config.charset
        )
    }

    function Module(uri, status) {
        this.uri = uri
        this.status = status || 0

        // this.id is set when saving
        // this.dependencies is set when saving
        // this.factory is set when saving
        // this.exports is set when compiling
        // this.parent is set when compiling
        // this.require is set when compiling
    }

    Module.prototype._use = function(ids, callback) {
        util.isString(ids) && (ids = [ids])
        var uris = resolve(ids, this.uri)

        this._load(uris, function() {
            var args = uris.map(function(uri) {
                return uri ? cachedModules[uri]._compile() : null
            })

            if (callback) {
                callback.apply(null, args)
            }
        })
    }


    Module.prototype._load = function(uris, callback) {
        var unLoadedUris = uris.filter(function(uri) {
            return uri && (!cachedModules[uri] ||
                cachedModules[uri].status < STATUS.READY)
        })

        var length = unLoadedUris.length
        if (length === 0) {
            callback()
            return
        }

        var remain = length

        for (var i = 0; i < length; i++) {
            (function(uri) {
                var module = cachedModules[uri] ||
                    (cachedModules[uri] = new Module(uri, STATUS.FETCHING))

                module.status >= STATUS.FETCHED ? onFetched() : fetch(uri, onFetched)

                function onFetched() {
                    // cachedModules[uri] is changed in un-correspondence case
                    module = cachedModules[uri]

                    if (module.status >= STATUS.SAVED) {
                        var deps = module.dependencies

                        if (deps.length) {
                            Module.prototype._load(deps, function() {
                                cb(module)
                            })
                        }
                        else {
                            cb(module)
                        }
                    }
                    // Maybe failed to fetch successfully, such as 404 or non-module.
                    // In these cases, just call cb function directly.
                    else {
                        cb()
                    }
                }

            })(unLoadedUris[i])
        }

        function cb(module) {
            (module || {}).status < STATUS.READY && (module.status = STATUS.READY)
            --remain === 0 && callback()
        }
    }


    Module.prototype._compile = function() {
        var module = this
        if (module.status === STATUS.COMPILED) {
            return module.exports
        }

        // Just return null when:
        //  1. the module file is 404.
        //  2. the module file is not written with valid module format.
        //  3. other error cases.
        if (module.status < STATUS.READY) {
            return null
        }

        module.status = STATUS.COMPILING


        function require(id) {
            var uri = resolve(id, module.uri)
            var child = cachedModules[uri]

            // Just return null when uri is invalid.
            if (!child) {
                return null
            }

            // Avoids circular calls.
            if (child.status === STATUS.COMPILING) {
                return child.exports
            }

            child.parent = module
            return child._compile()
        }

        require.async = function(ids, callback) {
            module._use(ids, callback)
        }


        module.require = require
        module.exports = {}
        var factory = module.factory

        if (util.isFunction(factory)) {

            runInModuleContext(factory, module)

        }
        else if (factory !== undefined) {
            module.exports = factory
        }

        module.status = STATUS.COMPILED
        return module.exports
    }


    function save(uri, meta) {
        var module = cachedModules[uri] || (cachedModules[uri] = new Module(uri))

        // Don't override already saved module
        if (module.status < STATUS.SAVED) {
            // Lets anonymous module id equal to its uri
            module.id = meta.id || uri

            module.dependencies = resolve(
                (meta.dependencies || []).filter(function(dep) {
                    return !!dep
                }), uri)

            module.factory = meta.factory

            // Updates module status
            module.status = STATUS.SAVED
        }

        return module
    }

    function runInModuleContext(fn, module) {
        var ret = fn(module.require, module.exports, module)
        if (ret !== undefined) {
            module.exports = ret
        }
    }


    var globalModule = new Module(pageUri, STATUS.COMPILED)

    seajs.use = function(id, callback){
        globalModule._use(id, callback)
    }

    global.define = function (id, deps, factory) {
        var argsLength = arguments.length

        // define(factory)
        if (argsLength === 1) {
            factory = id
            id = undefined
        }
        // define(id || deps, factory)
        else if (argsLength === 2) {
            factory = deps
            deps = undefined

            // define(deps, factory)
            if (Array.isArray(id)) {
                deps = id
                id = undefined
            }
        }

        // Parses dependencies.
        if (!Array.isArray(deps) && util.isFunction(factory)) {
            deps = parseDependencies(factory.toString())
        }

        var meta = { id:id, dependencies:deps, factory:factory }
        var derivedUri

        // Try to derive uri in IE6-9 for anonymous modules.
        if (document.attachEvent) {
            // Try to get the current script.
            // move to sea.ie.js?
            var script = util.getCurrentScript()

            if (script) {
                derivedUri = util.getScriptAbsoluteSrc(script)
            }

            if (!derivedUri) {
                util.log('Failed to derive URI from interactive script for:',
                    factory.toString())

                // NOTE: If the id-deriving methods above is failed, then falls back
                // to use onload event to get the uri.
            }
        }

        // Gets uri directly for specific module.
        var resolvedUri = id ? resolve(id) : derivedUri

        if (resolvedUri) {
            // For IE:
            // If the first module in a package is not the cachedModules[derivedUri]
            // self, it should assign to the correct module when found.
            if (resolvedUri === derivedUri) {
                var refModule = cachedModules[derivedUri]
                if (refModule && refModule.realUri &&
                    refModule.status === STATUS.SAVED) {
                    cachedModules[derivedUri] = null
                }
            }

            var module = save(resolvedUri, meta)

            // For IE:
            // Assigns the first module in package to cachedModules[derivedUrl]
            if (derivedUri) {
                // cachedModules[derivedUri] may be undefined in combo case.
                if ((cachedModules[derivedUri] || {}).status === STATUS.FETCHING) {
                    cachedModules[derivedUri] = module
                    module.realUri = derivedUri
                }
            }

        }
        else {
            // Saves information for "memoizing" work in the onload event.
            anonymousModuleMeta = meta
        }


    }


})(seajs._util, seajs._config, this)