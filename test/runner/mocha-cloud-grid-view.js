
/**
 * Module dependencies.
 */

var max = require('max-component')
  , sum = require('sum-component');

/**
 * Expose `GridView`.
 */

exports = module.exports = GridView;

/**
 * Default symbol map.
 */

exports.symbols = {
  ok: '✓',
  error: '✖',
  none: ' '
};

/**
 * Default color map.
 */

exports.colors = {
  ok: 32,
  error: 31,
  none: 0
};

/**
 * Initialize a grid view with the given `cloud` client.
 *
 * @param {Cloud} cloud
 * @param {Context} ctx
 * @api public
 */

function GridView(cloud, ctx) {
  this.ctx = ctx;
  this.cloud = cloud;
  this.browsers = cloud.browsers;
  this.max = this.maxWidth();
  cloud.on('init', this.oninit.bind(this));
  cloud.on('start', this.onstart.bind(this));
  cloud.on('end', this.onend.bind(this));
}

/**
 * Compute the max width.
 *
 * @return {Number}
 * @api private
 */

GridView.prototype.maxWidth = function(){
  return max(this.browsers, function(b){
    return Math.max(b.browserName.length, b.platform.length)
  });
};

/**
 * Size to `w` / `h`.
 *
 * @param {Number} w
 * @param {Number} h
 * @return {GridView} self
 * @api public
 */

GridView.prototype.size = function(w, h){
  this.w = w;
  this.h = h;
  return this;
};

/**
 * Handle init events.
 */

GridView.prototype.oninit = function(browser){
  browser.state = 'init';
  this.draw(this.ctx);
};

/**
 * Handle start events.
 */

GridView.prototype.onstart = function(browser){
  browser.state = 'start';
  this.draw(this.ctx);
};

/**
 * Handle end events.
 */

GridView.prototype.onend = function(browser, res){
  browser.state = 'end';
  browser.results = res;
  this.draw(this.ctx);
};

/**
 * Return symbol for `browser` based on its state.
 *
 * @param {Object} browser
 * @return {String}
 * @api private
 */

GridView.prototype.symbolFor = function(browser){
  if ('end' != browser.state) return exports.symbols.none;
  if (browser.results.failures) return exports.symbols.error;
  return exports.symbols.ok;
};

/**
 * Return color for `browser` based on its state.
 *
 * @param {Object} browser
 * @return {Number}
 * @api private
 */

GridView.prototype.colorFor = function(browser){
  if ('end' != browser.state) return exports.colors.none;
  if (browser.results.failures) return exports.colors.error;
  return exports.colors.ok;
};

/**
 * Sum of the total failures.
 *
 * @return {Number}
 * @api public
 */

GridView.prototype.totalFailures = function(){
  return sum(this.browsers, 'results.failures');
};

/**
 * Output failures.
 *
 * @api public
 */

GridView.prototype.showFailures = function(){
  this.browsers.forEach(function(browser){
    var n = 0;
    var res = browser.results;
    if (!res) throw new Error('no results for ' + format(browser));
    if (!res.failures) return;
    var failed = res.failed;
    console.log();
    console.log('   %s %s', browser.browserName, browser.version);
    console.log('   \033[90m%s\033[m', browser.platform);
    failed.forEach(function(test){
      var err = test.error;
      var msg = err.message || '';
      var stack = err.stack || msg;
      var i = stack.indexOf(msg) + msg.length;
      msg = stack.slice(0, i);
      console.log();
      console.log('    %d) %s', ++n, test.fullTitle);
      console.log('\033[31m%s\033[m', stack.replace(/^/gm, '       '));
    });
    console.log();
  });
};

/**
 * Render to `ctx`.
 *
 * @api public
 */

GridView.prototype.draw = function(ctx){
  var self = this;
  var max = this.max;
  var w = this.w;
  var h = this.h;
  var x = 4;
  var y = 3;

  this.browsers.forEach(function(browser){
    if (x + max > w - 5) { y += 3; x = 4; }
    var sym = self.symbolFor(browser);
    var color = self.colorFor(browser);
    var name = browser.browserName;
    var version = browser.version;
    var platform = browser.platform;
    var label = name + ' ' + version;
    var pad = ' ';
    var ppad = ' ';
    if(max - label.length > 0){
        pad = Array(max - label.length).join(' ');
    }
    if(max - platform.length + 2 > 0){
        ppad = Array(max - platform.length + 2).join(' ');
    }

    ctx.moveTo(x, y);
    ctx.write(label + pad);
    ctx.write(' \033[' + color + 'm' + sym + '\033[0m');
    ctx.moveTo(x, y + 1);
    ctx.write('\033[90m' + platform + ppad + '\033[0m');
    x += max + 6;
  });
  ctx.write('\n\n');
};

/**
 * Format browser string.
 */

function format(b) {
  return b.browserName + ' ' + b.version + ' on ' + b.platform
}