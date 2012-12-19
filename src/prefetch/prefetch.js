!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'prefetch';

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

    $.fn[pluginName] = function(){
        return this.each(function(){
            prefetch(this.href);
        });
    };

    // prefetch pages when anchors with data-prefetch are encountered
    // <a href="prefetchThisPage.html" data-prefetch> ... </a>
    $( window ).load(function() {
        $("a[data-prefetch]")[pluginName]();
    });


    return prefetch;

})