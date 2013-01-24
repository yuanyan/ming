!(function (factory) {
    if (typeof define === 'function') {
        define([
            './$',
            './class/class',
            './cookie/cookie',
            './cookie/remove',
            './cors/img',
            './cors/xdr',
            './history/history',
            './json/json',
            './jsonpi/jsonpi',
            './key/key',
            './memoize/memoize',
            './mousewheel/mousewheel',
            './object/keys',
            './postmessage/postmessage',
            './route/route',
            './storage/storage',
            './string/color',
            './string/format',
            './string/trim',
            './template/template',
            './touch/touch',
            './url/url',
            './uuid/uuid',
            './validate/validate',
            './uuid/uuid',
            './placeholder/placeholder',
            './datalink/datalink'
        ], factory);
    } else {
        factory($);
    }
})(function ($) {

});