/**
 * Clsss: Remote
 *
 *
 */

define("xdm/Remote", function(require, exports, module) {

    function getTimestamp() {
        return  +new Date();
    }

    /**
     *
     * @param method
     * @param action
     * @param data
     * @param opt_id
     * @return {String}
     */
    function requstWithResponse (method, action, data, opt_id){

        // Add the iframe with a unique name
        var iframe = document.createElement("iframe");
        var uniqueString = "cross_domain_withres_" + getTimestamp() || opt_id;
        document.body.appendChild(iframe);
        iframe.style.display = "none";
        iframe.contentWindow.name = uniqueString;
        iframe.id = uniqueString;

        // construct a form with hidden inputs, targeting the iframe
        var form = document.createElement("form");
        form.target = uniqueString;
        form.action = action;
        form.method = method;

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


    /**
     *
     * @param action
     * @param data
     * @param opt_id
     * @return {String}
     */
    function requestWithoutResponse (action, data, opt_id) {
        var uniqueString = "cross_domain_withoutres_"+ getTimestamp() || opt_id;
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
        requstWithResponse: requstWithResponse,
        requestWithoutResponse: requestWithoutResponse
    };

});