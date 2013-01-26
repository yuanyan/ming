route
=============


What it it
-----------------------

Web applications often provide linkable, bookmarkable, shareable URLs for important locations in the app. Until recently,
hash fragments (#page) were used to provide these permalinks, but with the arrival of the History API,
it's now possible to use standard URLs (/page). Backbone.Router provides methods for routing client-side pages,
and connecting them to actions and events. For browsers which don't yet support the History API, the Router handles
graceful fallback and transparent translation to the fragment version of the URL.

During page load, after your application has finished creating all of its routers, be sure to call Backbone.history.start(),
or Backbone.history.start({pushState: true}) to route the initial URL.

Usage / How it works
--------------------

history.start([options])

When all of your Routers have been created, and all of the routes are set up properly, call $.history.start() to begin monitoring hashchange events, and dispatching routes.

To indicate that you'd like to use HTML5 pushState support in your application, use $.history.start({pushState: true}). If you'd like to use pushState, but have browsers that don't support it natively use full page refreshes instead, you can add {hashChange: false} to the options.

If your application is not being served from the root url / of your domain, be sure to tell History where the root really is, as an option: $.history.start({pushState: true, root: "/public/search/"})

When called, if a route succeeds with a match for the current URL, $.history.start() returns true. If no defined route matches the current URL, it returns false.

If the server has already rendered the entire page, and you don't want the initial route to trigger when starting History, pass silent: true.

Because hash-based history in Internet Explorer relies on an <iframe>, be sure to only call start() after the DOM is ready.


```javascript
$.history.start({pushState: true});
```
