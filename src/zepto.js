!(function (factory) {
    if (typeof define === 'function') {
        define(['zepto'], factory);
    } else {
        factory($);
    }
})(function ($) {
    return $;
});