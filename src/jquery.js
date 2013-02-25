!(function (factory) {
    if (typeof define === 'function') {
        define(['jquery'], factory);
    } else {
        factory($);
    }
})(function ($) {
    return $;
});