var __require_config = {
    "packages": [
        {
            "name": "jquery",
            "location": "../lib/jquery",
            "main": "jquery.js"
        }
    ]
};

if (typeof require !== "undefined" && require.config) {
    require.config(__require_config);
}
else {
    var require = __require_config;
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = __require_config;
}


// r.js.cmd -o baseUrl=. paths.jquery=lib/jquery/jquery name=src/module.js out=dist/module.js