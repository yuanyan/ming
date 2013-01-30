var Cloud = require('./mocha-cloud');
var GridView = require('./mocha-cloud-grid-view');
var Canvas = require('term-canvas');
/**
 * Module dependencies.
 */

var cloud = new Cloud('ModuleJS', 'modulejs', '01acc19e-ac09-4594-b2fa-ea69690df91e');


var allDesired = [
    {
        browserName:'internet explorer',
        version: '6',
        platform: 'Windows 2003'
    }
    ,{
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
    }
//    ,{
//        browserName:'chrome',
//        platform: 'Windows 2003'
//    },
//    {
//        browserName:'chrome',
//        platform: 'Mac 10.8'
//    },
//    {
//        browserName:'chrome',
//        platform: 'Linux'
//    },
//    {
//        browserName:'android',
//        platform: 'Linux'
//    },
//    {
//        browserName:'ipad',
//        platform: 'Mac 10.8',
//        version: '5.1'
//    },
//    {
//        browserName:'ipad',
//        platform: 'Mac 10.8',
//        version: '6'
//    },
//    {
//        browserName:'iphone',
//        platform: 'Mac 10.8',
//        version: '5.1'
//    },
//    {
//        browserName:'iphone',
//        platform: 'Mac 10.8',
//        version: '6'
//    },
//    {
//        browserName:'firefox',
//        platform: 'Windows 2003'
//    },
//    {
//        browserName:'firefox',
//        platform: 'Windows 2008'
//    },
//    {
//        browserName: 'safari',
//        version: '5',
//        platform: 'Windows 2008'
//    },
//    {
//        browserName: 'safari',
//        version: '5',
//        platform: 'Mac 10.8'
//    },
//    {
//        browserName: 'opera',
//        version: '11',
//        platform: 'Windows 2003'
//    },
//    {
//        browserName: 'opera',
//        version: '12',
//        platform: 'Windows 2008'
//    }
];

allDesired.forEach(function(desired){
    cloud.browser(desired.browserName, desired.version || '', desired.platform);
});


cloud.tags =  ["2.0.0-dev"];
cloud.name = "ModuleJS";
cloud.build = 'main';
cloud.url = 'http://modulejs.github.com/modulejs/test/index.html';

var debug = function(){
    var DEBUG = false;
    if(DEBUG) console.log.apply(console, arguments);
};


cloud.on('init', function(browser){
    debug('  init : %s %s', browser.browserName, browser.version);
});

cloud.on('start', function(browser){
    debug('  start : %s %s', browser.browserName, browser.version);
});

cloud.on('end', function(browser, res){

    var passed = true;
    if(parseInt(res.failures)){
        passed = false;
    }

    cloud.passed(browser, passed);

    debug('  end : %s %s : %d failures', browser.browserName, browser.version, res.failures);
});


// setup
var size = process.stdout.getWindowSize()
var canvas = new Canvas(size[0], size[1]);
var ctx = canvas.getContext('2d');
var grid = new GridView(cloud, ctx);
grid.size(canvas.width, canvas.height);
ctx.hideCursor();

// trap SIGINT
//process.on('exit', function(){
//    ctx.reset();
//    process.nextTick(function(){
//        process.exit();
//    });
//});

// output failure messages
// once complete, and exit > 0
// accordingly
cloud.start(function(err){
    if (err) return debug(err);

    grid.showFailures();
    setTimeout(function(){
        ctx.showCursor();
        process.exit(grid.totalFailures());
    }, 100);
});








