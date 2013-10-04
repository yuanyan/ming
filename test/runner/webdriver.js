var Cloud = require('./mocha-cloud');
var GridView = require('./mocha-cloud-grid-view');
var Canvas = require('term-canvas');

var DEBUG = false;
for (var i = 0, args = process.argv.slice(2); i < args.length; i += 1) {
    if (args[i] === '--debug') {
        args.splice(i, 1);
        DEBUG = true;
    }
}

var debug = function(){
    if(DEBUG) console.log.apply(console, arguments);
};

/**
 * Module dependencies.
 */

var cloud = new Cloud('ModuleJS', 'modulejs', '01acc19e-ac09-4594-b2fa-ea69690df91e');

var allDesired = [
    {
        browserName:'android',
        version: '4.0',
        platform: 'Linux',
        'device-orientation' : 'portrait'
    }
    ,{
        browserName:'iphone',
        version: '5.0',
        platform: 'OS X 10.6',
        'device-orientation' : 'portrait'
    }
    ,{
        browserName:'iphone',
        version: '5.0',
        platform: 'OS X 10.6',
        'device-orientation' : 'portrait'
    }
    ,{
        browserName:'iphone',
        version: '5.1',
        platform: 'OS X 10.8',
        'device-orientation' : 'portrait'
    }
    ,{
        browserName:'iphone',
        version: '6',
        platform: 'OS X 10.8',
        'device-orientation' : 'portrait'
    }
    ,{
        browserName:'internet explorer',
        version: '6',
        platform: 'Windows XP'
    }
    ,{
        browserName:'internet explorer',
        version: '7',
        platform: 'Windows XP'
    }
    ,{
        browserName:'internet explorer',
        version: '8',
        platform: 'Windows XP'
    }
    ,{
        browserName:'internet explorer',
        version: '9',
        platform: 'Windows 7'
    }
    ,{
        browserName:'internet explorer',
        version: '10',
        platform: 'Windows 8'
    }
    ,{
        browserName:'chrome',
        platform: 'Windows 7'
    }
    ,{
        browserName:'safari',
        version: '5',
        platform: 'OS X 10.6'
    }
    ,{
        browserName:'safari',
        version: '6',
        platform: 'OS X 10.8'
    }
    ,{
        browserName:'firefox',
        platform: 'Windows 7'
    }
    ,{
        browserName:'opera',
        platform: 'Windows 7'
    }
];

allDesired.forEach(function(desired){
    cloud.browser(desired.browserName, desired.version || '', desired.platform);
});

cloud.tags =  ["3.0-dev"];
cloud.name = "Ming";
cloud.build = 'master';
cloud.url = 'http://rawgithub.com/modulejs/ming/master/test/index.html';

cloud.on('init', function(browser){
    debug('  init : %s %s', browser.browserName, browser.version);
});

cloud.on('start', function(browser){
    debug('  start : %s %s', browser.browserName, browser.version);
});

cloud.on('end', function(browser, res){

    debug('  end : %s %s : %d failures', browser.browserName, browser.version, res.failures);
});

if(!DEBUG){
    // setup
    var size = process.stdout.getWindowSize();
    var canvas = new Canvas(size[0], size[1]);
    var ctx = canvas.getContext('2d');
    var grid = new GridView(cloud, ctx);
    grid.size(canvas.width, canvas.height);
    ctx.hideCursor();

    process.on('exit', function(){
        process.nextTick(function(){
            process.exit();
        });
    });
}


// output failure messages
// once complete, and exit > 0
// accordingly
cloud.start(function(err){
    if (err) return debug(err);

    if(!DEBUG){
        grid.showFailures();
        setTimeout(function(){
            ctx.showCursor();
            process.exit(grid.totalFailures());
        }, 100);
    }
});
