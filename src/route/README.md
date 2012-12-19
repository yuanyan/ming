history
=============


What it it
-----------------------

History serves as a global router (per frame) to handle hashchange events or pushState, match the appropriate route,
and trigger callbacks. You shouldn't ever have to create one of these yourself — you should use the reference to $.history
that will be created for you automatically if you make use of Routers with routes.

pushState support exists on a purely opt-in basis in $. Older browsers that don't support pushState will
continue to use hash-based URL fragments, and if a hash URL is visited by a pushState-capable browser,
it will be transparently upgraded to the true URL. Note that using real URLs requires your web server to be able to correctly render those pages,
so back-end changes are required as well. For example, if you have a route of /documents/100,
 your web server must be able to serve that page, if the browser visits that URL directly.
 For full search-engine crawlability, it's best to have the server generate the complete HTML for the page ...
 but if it's a web application, just rendering the same content you would have for the root URL,
 and filling in the rest with Views and JavaScript works fine.

Usage / How it works
--------------------

### extend

Get started by creating a custom router class. Define actions that are triggered when certain URL fragments are matched,
and provide a routes hash that pairs routes to actions. Note that you'll want to avoid using a leading slash in your route definitions:


```javascript
var WorkspaceRouter = $.extend({

  routes: {
    "help":                 "help",    // #help
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  help: function() {
    ...
  },

  search: function(query, page) {
    ...
  }

}, $.Router);
```

### routes

The routes hash maps URLs with parameters to functions on your router, similar to the View's events hash. Routes can contain parameter parts, :param, which match a single URL component between slashes; and splat parts *splat, which can match any number of URL components. Part of a route can be made optional by surrounding it in parentheses (/:optional).

For example, a route of "search/:query/p:page" will match a fragment of #search/obama/p2, passing "obama" and "2" to the action.

A route of "file/*path" will match #file/nested/folder/file.txt, passing "nested/folder/file.txt" to the action.

A route of "docs/:section(/:subsection)" will match #docs/faq and #docs/faq/installing, passing "faq" to the action in the first case, and passing "faq" and "installing" to the action in the second.

When the visitor presses the back button, or enters a URL, and a particular route is matched, the name of the action will be fired as an event, so that other objects can listen to the router, and be notified. In the following example, visiting #help/uploading will fire a route:help event from the router.

```js
routes: {
  "help/:page":         "help",
  "download/*path":     "download",
  "folder/:name":       "openFolder",
  "folder/:name-:mode": "openFolder"
}
```

```js
router.on("route:help", function(page) {
  ...
});
```

### constructor / initialize

When creating a new router, you may pass its routes hash directly as an option, if you choose. All options will also be passed to your initialize function, if defined.

```
new Router([options])
```

### route

Manually create a route for the router, The route argument may be a routing string or regular expression.
Each matching capture from the route or regular expression will be passed as an argument to the callback.
The name argument will be triggered as a "route:name" event whenever the route is matched.
If the callback argument is omitted router[name] will be used instead.

```js
initialize: function(options) {

  // Matches #page/10, passing "10"
  this.route("page/:number", "page", function(number){ ... });

  // Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
  this.route(/^(.*?)\/open$/, "open");

},

open: function(id) { ... }
```


### navigate

Whenever you reach a point in your application that you'd like to save as a URL,
call navigate in order to update the URL. If you wish to also call the route function,
set the trigger option to true. To update the URL without creating an entry in the browser's history,
 set the replace option to true.

```js
openPage: function(pageNumber) {
  this.document.pages.at(pageNumber).open();
  this.navigate("page/" + pageNumber);
}

# Or ...

app.navigate("help/troubleshooting", {trigger: true});

# Or ...

app.navigate("help/troubleshooting", {trigger: true, replace: true});
```