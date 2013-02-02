addEventListener('message', function(e) {
    var message = e.data,
        id = message.id,
        options = message.options,
        xhr = new XMLHttpRequest(),
        method = (options.method || 'POST').toUpperCase(),
        url = options.url,
        async = ('async' in options) ? options.async : true,
        contentType = options.contentType,
        responseType = options.responseType,
        headers = options.headers,
        data = options.data || null,
        noCache = ('noCache' in options) ? options.noCache : true,
        key, value;

    if (noCache) {
        url = url + ((url.indexOf('?') === -1) ? '?' : '&') + '_dc=' + Date.now();
    }

    xhr.open(method, url, async);
    xhr.setRequestHeader('Content-Type', contentType);

    if (headers) {
        for (key in headers) {
            value = headers[key];
            xhr.setRequestHeader(key, value);
        }
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var status = xhr.status,
                postedMessage = {
                    id: id
                };

            if ((status >= 200 && status < 300) || status == 304 || (status == 0 && xhr.responseText.length > 0)) {
                if (responseType !== 'none') {
                    if (responseType === 'json') {
                        postedMessage.response = JSON.parse(xhr.responseText);
                    }
                    else {
                        postedMessage.response = xhr.responseText;
                    }
                }
            }
            else {
                postedMessage.error = "HTTP status code: " + status + (xhr.statusText ? " (" + xhr.statusText + ")" : "");
            }

            postMessage(postedMessage);
        }
    };

    xhr.send(data);
});