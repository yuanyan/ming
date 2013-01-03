<a name="memoize" />
### memoize(fn, [hasher])

Caches the results of an async function. When creating a hash to store function
results against, the callback is omitted from the hash and an optional hash
function can be used.

__Arguments__

* fn - the function you to proxy and cache results from.
* hasher - an optional function for generating a custom hash for storing
  results, it has all the arguments applied to it apart from the callback, and
  must be synchronous.

__Example__

```js
var slow_fn = function (name, callback) {
    // do something
    callback(null, result);
};
var fn = $.memoize(slow_fn);

// fn can now be used as if it were slow_fn
fn('some name', function () {
    // callback
});
```

<a name="unmemoize" />
### unmemoize(fn)

Undoes a memoized function, reverting it to the original, unmemoized
form. Comes handy in tests.

__Arguments__

* fn - the memoized function