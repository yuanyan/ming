!(function (factory) {
    if (typeof define === 'function') {
        define([
            './$',
            './class/class',
            './eventemitter/eventemitter',
            './runtime/object',
            './cookie/cookie',
            './cookie/remove',
            './cors/img',
            './cors/xdr',
            './history/history',
            './json/json',
            './jsonpi/jsonpi',
            './key/key',
            './memoize/memoize',
            './memoize/unmemoize',
            './mousewheel/mousewheel',
            './object/keys',
            './postmessage/postmessage',
            './postmessage/receivemessage',
            './route/route',
            './storage/storage',
            './color/color',
            './format/format',
            './escape/escape',
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
   return $
});