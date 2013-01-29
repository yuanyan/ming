var Cloud = require('mocha-cloud');
var cloud = new Cloud('ModuleJS', 'modulejs', '01acc19e-ac09-4594-b2fa-ea69690df91e');

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

allDesired.forEach(function(desired){
    cloud.browser(desired.browserName, desired.version || '', desired.platform);
});

cloud.tags =  ["2.0.0-dev"];
cloud.name = "ModuleJS";

cloud.url('http://modulejs.github.com/modulejs/test/index.html');

cloud.on('init', function(browser){
    console.log('  init : %s %s', browser.browserName, browser.version);
});

cloud.on('start', function(browser){
    console.log('  start : %s %s', browser.browserName, browser.version);
});

cloud.on('end', function(browser, res){
    console.log('  end : %s %s : %d failures', browser.browserName, browser.version, res.failures);
});

cloud.start();

