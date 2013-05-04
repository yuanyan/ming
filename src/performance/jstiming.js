!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'jstiming';

    function Ticker(x) {
        this.t = {};
        this.tick = function tick(name, data, time) {
            time = time ? time : (new Date).getTime();
            this.t[name] = [time, data];
        };
        this.tick("start", null, x);
    }

    window.jstiming = {
        Timer: Ticker,
        load: new Ticker
    };


    if (window.performance && window.performance.timing) {
        var timing = window.performance.timing,
            load = window.jstiming.load,
            ns = timing.navigationStart,
            rs = timing.responseStart,
            re = timing.responseEnd;

        0 < ns && rs >= ns && ( load.tick("navigationStart", null, ns), load.tick("responseStart", null, rs), load.tick("responseEnd", null, re) );
    }

    // http://src.chromium.org/viewvc/chrome/trunk/src/chrome/renderer/loadtimes_extension_bindings.cc?revision=22896&view=markup&pathrev=28136
    try {
        var pt = null;
        if (window.chrome && window.chrome.csi)
            pt = Math.floor(window.chrome.csi().pageT);
        if (pt == null && window.gtbExternal)
            pt = window.gtbExternal.pageT();
        if (pt == null && window.external)
            pt = window.external.pageT;
        if (pt) window.jstiming.pt = pt;
    } catch (e) {};

    window.tickAboveFold = function tickAboveFold(node) {
        var y = 0;
        if (node.offsetParent) {
            do y += node.offsetTop;
            while ((node = node.offsetParent))
        }
        if (y <= 750) window.jstiming.load.tick("aft");
    };

    var alreadyLoggedFirstScroll = false;

    function onScroll() {
        if (!alreadyLoggedFirstScroll) {
            alreadyLoggedFirstScroll = true;
            window.jstiming.load.tick("firstScrollTime");
        }
    }

    if (window.addEventListener)
        window.addEventListener("scroll", onScroll, false);
    else
        window.attachEvent("onscroll", onScroll);

    $[pluginName] = jstiming;
})