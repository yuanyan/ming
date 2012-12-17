!(function (name, factory) {
    if (!factory) {
        factory = name;
        name = null;
    }
    if (typeof define === 'function') {
        // *MD Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        exports = factory(require('jquery'));
    } else {
        var $ = this.jQuery || this.$;
        var ret = factory($);
        // Assign to common namespaces or simply the global object (window)
        name && ret && (($ || this)[name] = ret);
    }
})('prefetch', function ($) {

    var prefetchRel = 'prefetch prerender';
    var prefetchUrls = {};
    var prefetchWorker;
    var isSupportWorker = window.Worker && window.Blob;

    function xhrFetch(evt){
        try{
            var url = evt.data || evt;
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = function(){}; // fix a memory leak in IE
                }
            };
            xhr.open("GET", url);
            xhr.send(null);
        }catch(e){
            //console.log(e)
        }

    }


    // prefetch
    var prefetch = function(url){
        if ( url && !prefetchUrls[url] ) {

            if( isSupportWorker ){

                if(!prefetchWorker){
                    window.URL = window.URL || window.webkitURL;
                    var blob = new Blob(["onmessage = "+ fetch.toString() ]);
                    // Obtain a blob URL reference to our worker 'file'.
                    var blobURL = window.URL.createObjectURL(blob);
                    prefetchWorker = new Worker(blobURL);
                }

                prefetchWorker.postMessage(url);

            } else {

                var link = $('<link />', { rel: prefetchRel, href: url } );
                $('head').append( link );

                xhrFetch(url);

            }

            prefetchUrls[url]= true;

        }
    };

    $.fn.prefetch = function(){
        return this.each(function(){
            prefetch(this.href);
        });
    };

    //prefetch pages when anchors with data-prefetch are encountered
    // <a href="prefetchThisPage.html" data-prefetch> ... </a>
    $( window ).load(function() {
        $("a[data-prefetch]").prefetch();
    });

    return prefetch;
})