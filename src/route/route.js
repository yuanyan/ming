!(function (name, factory) {
    if (typeof define === 'function') {
        define(name, ['jquery','history'], factory);

    } else {
        var $ = this.jQuery || this.$;
        var ret = factory($, $.history);
        ret && (($ || this)[name] = ret);
    }
})('route', function ($, history) {

    // https://github.com/PaulKinlan/leviroutes/blob/master/routes.js
    var _routes = [];

    var parseRoute = function(loc) {
        var nameRegexp = new RegExp(":([^/.\\\\]+)", "g");
        var newRegexp = "" + loc;
        var groups = {};
        var matches = null;
        var i = 0;

        // Find the places to edit.
        while(matches = nameRegexp.exec(loc)) {
            groups[matches[1]] = i++;
            newRegexp = newRegexp.replace(matches[0], "([^/.\\\\]+)");
        }

        newRegexp += "$"; // Only do a full string match

        return { "groups" : groups, "regexp": new RegExp(newRegexp)};
    };

    var matchRoute = function(url) {
        var route = null;
        for(var i = 0; route = _routes[i]; i ++) {
            var routeMatch = route.regex.regexp.exec(url);
            if(!!routeMatch == false) continue;

            var params = {};
            for(var g in route.regex.groups) {
                var group = route.regex.groups[g];
                params[g] = routeMatch[group + 1];
            }

            route.callback({"url": url, "params": params});
            return true;
        }

        return false;
    };

    history.on(function(){
        matchRoute(document.location.pathname);
    });

    return $.route = function(route, callback) {
        _routes.push({regex: parseRoute(route), "callback": callback});
    };

})