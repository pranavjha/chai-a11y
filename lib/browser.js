/* globals window, document, axs */
// ## plugin implementation for browsers.
'use strict';
var $ = require('jquery');

// this function loads accessibility developer tools in the browser environment by injecting a script tag if it doesn't
// already exist. Once it ensures that the accessibility tool is loaded in the browser, it calls the callback
var loadPlugin = function(cb, eb) {
    if (!window.auditRunner) {
        // add the accessibility tool if not present
        var scriptTag = document.createElement('script');
        scriptTag.type = 'text\/javascript';
        scriptTag.onerror = eb;
        // call the callback once the script loads
        scriptTag.onload = cb;
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
        // [why rawgit.com instead of raw.github.com]
        // (http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github)
        scriptTag.src = '//raw.githubusercontent.com/pranavjha/a11y-auditor/master/dist/a11y-auditor.js';
    } else {
        // if accessibility tools are present, call the callback directly
        window.setTimeout(cb);
    }
};

// actual plugin implementation
module.exports = function chaiAccessibility(chai) {
    var Assertion = chai.Assertion;
    Assertion.addMethod('accessible', function(config) {
        var deferred = $.Deferred();
        // fetch the element, Element here can be a DOM element, a jQuery element or a HTML String. So, we wrap it in a
        // jQuery object to normalize
        var element = $(this._obj);
        // this boolean is true if the element send was not a part of the DOM and is appended to the DOM by this
        // assertion library
        var isOrphan = !$.contains(document, element.get(0));
        if (isOrphan) {
            // if the element is not in the dom, we append it into the DOM
            element.appendTo($('body'));
        }
        loadPlugin(function() {
            // Run the auditor
            // normalize config
            config = require('./utils/normalize-config')(config);
            // Run the auditor
            var response = auditRunner(element, config.ignore);
            // parse the audit results
            var errorCount = require('./utils/stringify-response')(response);
            if (isOrphan) {
                // if the element was not in the dom, we remove it
                element.remove();
            }
            if (!errorCount) {
                // if the audit is successful, the test passes
                deferred.resolve('OK');
            } else {
                // if the audit fails, the test fails
                deferred.reject(new Error(errorCount + ' issues reported!'));
            }
        }, function(e) {
            // fail the test if the plugin doesn't load
            deferred.reject(e);
        });
        return deferred.promise();
    });
};
