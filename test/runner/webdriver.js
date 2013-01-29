var webdriver = require('wd')
    , assert = require('assert');

var browser = webdriver.remote(
    "ondemand.saucelabs.com"
    , 80
    , "modulejs"
    , "01acc19e-ac09-4594-b2fa-ea69690df91e"
);

browser.on('status', function(info){
    console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});


var baseDesiredInfo = {
    tags: ["2.0"]
    , build: "master"
    , passed: true
    , name: "ModuleJS"
};

var allDesired = [
    {
        browserName:'internet explorer',
        version: '6',
        platform: 'Windows 2003'
    },
    {
        browserName:'internet explorer',
        version: '7',
        platform: 'Windows 2003'
    },
    {
        browserName:'internet explorer',
        version: '8',
        platform: 'Windows 2003'
    },
    {
        browserName:'internet explorer',
        version: '9',
        platform: 'Windows 2008'
    },
    {
        browserName:'internet explorer',
        version: '10',
        platform: 'Windows 2012'
    },
    {
        browserName:'chrome',
        platform: 'Windows 2003'
    },
    {
        browserName:'chrome',
        platform: 'Mac 10.8'
    },
    {
        browserName:'chrome',
        platform: 'Linux'
    },
    {
        browserName:'android',
        platform: 'Linux'
    },
    {
        browserName:'ipad',
        platform: 'Mac 10.8',
        version: '5.1'
    },
    {
        browserName:'ipad',
        platform: 'Mac 10.8',
        version: '6'
    },
    {
        browserName:'iphone',
        platform: 'Mac 10.8',
        version: '5.1'
    },
    {
        browserName:'iphone',
        platform: 'Mac 10.8',
        version: '6'
    },
    {
        browserName:'firefox',
        platform: 'Windows 2003'
    },
    {
        browserName:'firefox',
        platform: 'Windows 2008'
    },
    {
        browserName: 'safari',
        version: '5',
        platform: 'Windows 2008'
    },
    {
        browserName: 'safari',
        version: '5',
        platform: 'Mac 10.8'
    },
    {
        browserName: 'opera',
        version: '11',
        platform: 'Windows 2003'
    },
    {
        browserName: 'opera',
        version: '12',
        platform: 'Windows 2008'
    }
];

var extend = function(destination, source) {

    if (source) {
        for (var prop in source) {
            destination[prop] = source[prop];
        }
    }

    return destination;
};

allDesired.forEach(function(val){

    var desired = extend(val, baseDesiredInfo);

    browser.init(desired, function() {

        browser.get("http://modulejs.github.com/modulejs/test/index.html", function() {

            browser.quit()
        })
    })
})


