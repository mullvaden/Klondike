/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var select = require('broccoli-select');
var gitDescribe = require('./broccoli-git-describe.js');

var app = new EmberApp();

app.import('vendor/momentjs/moment.js');
app.import('vendor/nprogress/nprogress.js');
app.import('vendor/nprogress/nprogress.css');

app.import({
    development: 'vendor/jquery-signalr/jquery.signalR.js',
    production: 'vendor/jquery-signalr/jquery.signalR.min.js'
});

app.import({
    development: 'vendor/zeroclipboard/ZeroClipboard.js',
    production: 'vendor/zeroclipboard/ZeroClipboard.min.js'
});

app.index = function() {
    var defaultIndexTree = EmberApp.prototype.index.apply(app);
    return gitDescribe(defaultIndexTree);
}

var assetTree = pickFiles('vendor', {
  srcDir: '/',
  files: [
  	'bootstrap-sass-official/assets/fonts/bootstrap/*',
  	'font-awesome/fonts/*',
  	'zeroclipboard/ZeroClipboard.swf'
  ],
  destDir: '/assets'
});

module.exports = app.toTree([assetTree]);
