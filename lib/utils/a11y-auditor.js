/* globals phantom, axs */
// Conducts audits using the Chrome Accessibility Tools and PhantomJS.
'use strict';
var system = require('system');
var webpage = require('webpage').create();
var config = JSON.parse(system.args[1]);
var PAGE_TIMEOUT = 9000;
// path for accessibility testing files
var TOOLS_PATH = 'node_modules/accessibility-developer-tools/dist/js/axs_testing.js';
// formats the webpage error for readability
var formatTrace = function(trace) {
    var src = trace.file || trace.sourceURL;
    var fn = (trace.function ? ' in function ' + trace.function : '');
    return '→ ' + src + ' on line ' + trace.line + fn;
};

// console.error is broken in PhantomJS
console.error = function() {
    system.stderr.writeLine([].slice.call(arguments).join(' '));
};

webpage.settings.resourceTimeout = PAGE_TIMEOUT;

webpage.viewportSize = {
    width: config.width,
    height: config.height
};

webpage.onResourceTimeout = function(err) {
    console.log('Error code:' + err.errorCode + ' ' + err.errorString + ' for ' + err.url);
    phantom.exit(1);
};

webpage.onError = function(err, trace) {
    console.error(err + '\n' + formatTrace(trace[0]) + '\n');
};

webpage.open(config.url, function(status) {
    if (status === 'fail') {
        console.error('Couldn\'t load url.');
        phantom.exit(1);
    }

    // Inject axs_testing
    webpage.injectJs(TOOLS_PATH);
    var ret = webpage.evaluate(function(config) {
        // Run the auditor
        var configuration = new axs.AuditConfiguration();
        configuration.showUnsupportedRulesWarning = false;
        // normalize config
        config.ignore.forEach(function(ignores) {
            configuration.ignoreSelectors(ignores[0], ignores[1] || '*');
        });
        return axs.Audit.run(configuration);
    }, config);

    if (!ret) {
        system.stderr.writeLine('Audit failed');
        phantom.exit(1);
        return;
    }
    // log the result in console so that it can be picked up form node
    console.log(JSON.stringify(ret));
    phantom.exit();
});