/**
 * Clsss: Remote
 *
 *
 */

define("xdm.Remote", function(require, exports, module) {

    function getTimestamp() {
        return  +new Date();
    }

    function crossDomainPost (action, data) {

        // Add the iframe with a unique name
        var iframe = document.createElement("iframe");
        var uniqueString = "cross_domain_post_" + getTimestamp();
        document.body.appendChild(iframe);
        iframe.style.display = "none";
        iframe.contentWindow.name = uniqueString;

        // construct a form with hidden inputs, targeting the iframe
        var form = document.createElement("form");
        form.target = uniqueString;
        form.action = action;
        form.method = "POST";

        for(var key in data){
            if(data.hasOwnProperty(key)){
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);
        form.submit();

        return uniqueString;
    }

    function crossDomainGet (action, data) {
        var uniqueString = "cross_domain_get_"+ getTimestamp();
        var img = window[uniqueString] = new Image;

        img.onerror = img.onload = function(){
            window[uniqueString] = null;
        };

        var params = [];

        for(var key in data) {
            if(data.hasOwnProperty(key)){
                 params.push(key + "=" + data[key]);
            }
        }

        img.src = action + (data? "?": "") + params.join("&") ;
        img = null;

        return uniqueString;
    }


 	//EXPOSE
    return {
        post: crossDomainPost,
        get: crossDomainGet
    };

});