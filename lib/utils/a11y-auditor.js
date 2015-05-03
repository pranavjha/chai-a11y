/* globals phantom, axs */
// Conducts audits using the Chrome Accessibility Tools and PhantomJS.
'use strict';
var system = require('system');
var webpage = require('webpage').create();
var opts = JSON.parse(system.args[1]);
var PAGE_TIMEOUT = 9000;
// path for accessibility testing files
var TOOLS_PATH = 'node_modules/accessibility-developer-tools/dist/js/axs_testing.js';
// formats the webpage error for readability
var formatTrace = function (trace) {
  var src = trace.file || trace.sourceURL;
  var fn = (trace.function ? ' in function ' + trace.function : '');
  return '→ ' + src + ' on line ' + trace.line + fn;
};

// console.error is broken in PhantomJS
console.error = function () {
  system.stderr.writeLine([].slice.call(arguments).join(' '));
};

webpage.settings.resourceTimeout = PAGE_TIMEOUT;

webpage.viewportSize = {
  width: opts.width,
  height: opts.height
};

webpage.onResourceTimeout = function (err) {
  console.log('Error code:' + err.errorCode + ' ' + err.errorString + ' for ' + err.url);
  phantom.exit(1);
};

webpage.onError = function (err, trace) {
  console.error(err + '\n' + formatTrace(trace[0]) + '\n');
};

webpage.open(opts.url, function (status) {
  if (status === 'fail') {
    console.error('Couldn\'t load url.');
    phantom.exit(1);
  }

  // Inject axs_testing
  webpage.injectJs(TOOLS_PATH);

  var ret = webpage.evaluate(function () {
    return axs.Audit.run();
  });

  if (!ret) {
    system.stderr.writeLine('Audit failed');
    phantom.exit(1);
    return;
  }
  // log the result in console so that it can be picked up form node
  console.log(JSON.stringify(ret));
  phantom.exit();
});