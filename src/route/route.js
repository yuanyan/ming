!(function (factory) {
    if (typeof define === 'function') {
        define(['$', '../history/history', '../object/keys'], factory);
    } else {
        factory($, $.history, $.keys);
    }
})(function ($, history, keys) {

    'use strict';
    var pluginName = 'route';

    // $.Router
    // ---------------

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router =  function(options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Set up all inheritable **$.Router** properties and methods.
    Router.prototype = {

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){},

        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function(route, name, callback) {
            if (typeof route === 'string') route = this._routeToRegExp(route);
            if (!callback) callback = this[name];
            history.route(route, $.proxy(function(fragment) {
                var args = this._extractParameters(route, fragment);
                callback && callback.apply(this, args);
                // TODO: support it
                //this.trigger.apply(this, ['route:' + name].concat(args));

                //history.trigger('route', this, name, args);
            }, this));
            return this;
        },

        // Simple proxy to `$.history` to save a fragment into the history.
        navigate: function(fragment, options) {
            history.navigate(fragment, options);
            return this;
        },

        // Bind all defined routes to `$.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function() {
            if (!this.routes) return;
            var route, routes = keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, '([^\/]+)')
                .replace(splatParam, '(.*?)');
            return new RegExp('^' + route + '$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted parameters.
        _extractParameters: function(route, fragment) {
            return route.exec(fragment).slice(1);
        }

    };

    return $.Router = Router;

})