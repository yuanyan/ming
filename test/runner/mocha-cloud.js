var Emitter = require('events').EventEmitter;
var Batch = require('batch');
var wd = require('wd');
var request  = require('request');

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


var extend = function(destination, source) {

    if (source) {
        for (var prop in source) {
            destination[prop] = source[prop];
        }
    }

    return destination;
};


/**
 * Expose `Cloud`.
 */

module.exports = Cloud;

/**
 * Initialize a cloud test with
 * project `name`, your saucelabs username / key.
 *
 * @param {String} name
 * @param {String} user
 * @param {String} key
 * @api public
 */

function Cloud(name, user, key) {
    this.name = name;
    this.user = user;
    this.key = key;
    this.browsers = [];
    this.url = '';
    this.tags = [];
    this.build = '';
}

/**
 * Inherits from `Emitter.prototype`.
 */

Cloud.prototype.__proto__ = Emitter.prototype;

/**
 * Add browser for testing.
 *
 * View https://saucelabs.com/docs/browsers for details.
 *
 * @param {String} name
 * @param {String} version
 * @param {String} platform
 * @return {Cloud} self
 * @api public
 */

Cloud.prototype.browser = function(name, version, platform){
    debug('add %s %s %s', name, version, platform);
    this.browsers.push({
        browserName: name,
        version: version,
        platform: platform
    });
};

/**
 * Start cloud tests and invoke `fn(err, results)`.
 *
 * Emits:
 *
 *   - `init` (browser) testing initiated
 *   - `start` (browser) testing started
 *   - `end` (browser, results) test results complete
 *
 * @param {Function} fn
 * @api public
 */

Cloud.prototype.start = function(fn){
    var self = this;
    var batch = new Batch;
    fn = fn || function(){};

    this.browsers.forEach(function(conf){
        conf.tags = self.tags;
        conf.name = self.name;
        conf.build = self.build;

        batch.push(function(done){
            debug('running %s %s %s', conf.browserName, conf.version, conf.platform);
            var browser = wd.remote('ondemand.saucelabs.com', 80, self.user, self.key);

            self.emit('init', conf);
            browser.init(conf, function(err, sessionID){
                if (err) return done(err);

                conf.sessionID = browser.sessionID;

                debug('open %s', self.url);
                self.emit('start', conf);

                browser.get(self.url, function(err){
                    if (err) return done(err);

                    function wait() {
                        browser.eval('window.mochaResults', function(err, res){
                            if (err) return done(err);

                            if (!res) {
                                debug('waiting for results');
                                setTimeout(wait, 1000);
                                return;
                            }

                            debug('results %j', res);
                            conf.job = browser;
                            self.emit('end', conf, res);
                            self.passed(conf, res, done);
                        });
                    }

                    wait();
                });
            });
        });
    });

    batch.end(fn);
};


Cloud.prototype.passed = function(conf, res, callback) {

    var passed = true;
    if(parseInt(res.failures)){
        passed = false;
    }

    this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
    var _body = JSON.stringify({ "passed": passed }),
        url = this.baseUrl + "/jobs/" + conf.job.sessionID;


    conf.job.quit(function(){
        request({
            headers: { 'content-type' : 'application/x-www-form-urlencoded' },
            method: "PUT",
            url: url,
            body: _body,
            json: true,
            proxy: process.env.http_proxy
        }, function(err, response, body) {
            callback && callback(err, response, body);
        });
    });
};
