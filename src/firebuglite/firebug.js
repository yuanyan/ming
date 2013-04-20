!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';

    // 用于在无调试器的客户端中，呼出方式, 先 ctrl + f12 加载firebug-lite， 再 f12 打开调试窗口
    $(document).on('keydown', function(event){

        // CODE = {f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123};
        if(event.keyCode === 123 && event.ctrlKey) {

            (function (F, i, r, e, b, u, g, L, I, T, E) {
                if (F.getElementById(b))return;
                E = F[i + 'NS'] && F.documentElement.namespaceURI;
                E = E ? F[i + 'NS'](E, 'script') : F[i]('script');
                E[r]('id', b);
                E[r]('src', I + g + T);
                E[r](b, u);
                (F[e]('head')[0] || F[e]('body')[0]).appendChild(E);
                E = new Image;
                E[r]('src', I + L);
            })(document, 'createElement', 'setAttribute', 'getElementsByTagName', 'FirebugLite', '4', 'build/firebug-lite.js', 'skin/xp/sprite.png', 'http://pub.idqqimg.com/lib/firebug-lite/', '#startOpened');
        }

    });


})