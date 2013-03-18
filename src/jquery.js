!(function (factory) {
    if (typeof define === 'function') {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
    return $;
});