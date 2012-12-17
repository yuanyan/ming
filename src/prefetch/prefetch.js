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

    var prefetchRel = 'prefetch prerender',
        prefetchUrls = {},
        prefetchWorker,
        isSupportWorker = window.Worker && window.Blob;

    function isSameDomain(url){
        var parser = document.createElement('a');
        parser.href = url;

        return parser.protocol == location.protocol && parser.hostname == location.hostname && parser.port == location.port;

    }

    function fetch(e){
        try{
            var url = e.data || e,
                xhr = new XMLHttpRequest();

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
    $.prefetch = $.fn.prefetch = function(){

        return this.each(function(){

            var $this = $(this),
                url = $this.attr('href');

            if ( url && !prefetchUrls[url] ) {

                if( isSameDomain(url) ){

                    if(isSupportWorker){

                        if(!prefetchWorker){
                            window.URL = window.URL || window.webkitURL;
                            var blob = new Blob(["onmessage = "+ fetch.toString() ]);
                            // Obtain a blob URL reference to our worker 'file'.
                            var blobURL = window.URL.createObjectURL(blob);
                            prefetchWorker = new Worker(blobURL);
                        }

                        prefetchWorker.postMessage(url);

                    }else{
                        fetch(url);
                    }

                }else{

                    var link = $('<link />', { rel: prefetchRel, href: url } );
                    var script = $('<script />', { type: "text/prefetch", src: url } );
                    $('head').append( link.after(script) );

                }

                prefetchUrls[url]= true;

            }
        });
    };

    //prefetch pages when anchors with data-prefetch are encountered
    // <a href="prefetchThisPage.html" data-prefetch> ... </a>
    $( window ).load(function() {
        $("a[data-prefetch]").each(function() {
            $(this).prefetch();
        });
    });
})