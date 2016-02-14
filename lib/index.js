// ## Chai Accessibility Plugin
//
// Here, we make sure that the plugin works in the below 3 scenarios:
//
//  - When run from NodeJS
//  - When run in a browser, transformed using browserify
//  - When used in a browser using amd like requirejs
//  - When included as a script tag on the page
(function() {
    'use strict';
    // this function loads accessibility developer tools in the browser environment by injecting a script tag if it
    // doesn't already exist. Once it ensures that the accessibility tool is loaded in the browser, it calls the
    // callback
    var loadPlugin = function(cb, eb) {
        /* global window */
        if (!window.auditRunner) {
            cb();
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
            // if accessibility tools are present, call the callback directly, but in a different call stack
            window.setTimeout(cb);
        }
    };

    // This function normalizes the config object.
    var normalizeConfig = function(config) {
        config = config || {};
        config.ignore = config.ignore || [];
        if (typeof config.ignore === 'string') {
            config.ignore = {
                html: config.ignore
            };
        }
        Object.keys(config.ignore).forEach(function(selector) {
            if (typeof config.ignore[selector] === 'string') {
                config.ignore[selector] = [
                    config.ignore[selector]
                ];
            }
        });
        return config;
    };

    // creates a message string from the response object received from the axs audit
    var stringifyResponse = function(response) {
        var messageCount = 0;
        Array.prototype.concat.apply([], Object.keys(response).map(function(ruleKey) {
            return response[ruleKey];
        })).filter(function(item) {
            // filter all the FAILed cases
            return (item.errMsg.indexOf('Failed!') === 0);
        }).forEach(function(item) {
            messageCount++;
            // get the important information in the string to be returned
            console.log('Description:     ' + item.description);
            console.log('Error Message:   ' + item.errMsg);
            console.log('Rule ID:         ' + item.ruleID);
            console.log('Severity:        ' + item.severityEnum);
            console.log('');
        });
        return messageCount;
    };

    // modules will have keys: $ and auditRunner
    var chaiAccessibility = function(chai, utils, modules) {
        /* global document */
        var $ = modules.$;
        var Assertion = chai.Assertion;
        Assertion.addMethod('accessible', function(config) {
            // get the modules for use
            var element = $(this._obj);
            // check if the element is a part of DOM
            var isOrphan = !$.contains(document, element.get(0));
            if (isOrphan) {
                // if the element is not in the dom, we append it into the DOM
                element.appendTo($('body'));
            }
            var deferred = $.Deferred();
            if (modules.auditRunner) {
                window.auditRunner = modules.auditRunner;
            }
            loadPlugin(function() {
                /* global axs */
                // normalize config
                config = normalizeConfig(config);
                // Run the auditor
                var response = auditRunner(element, config.ignore);
                // parse the audit results
                var errorCount = stringifyResponse(response);
                if (isOrphan) {
                    // if the element was not in the dom, we remove it
                    element.remove();
                }
                if (errorCount) {
                    deferred.reject(new Error(errorCount + ' issues reported!'));
                } else {
                    deferred.resolve('OK');
                }
            }, function(e) {
                deferred.reject(e);
            });
            return deferred.promise();
        });
    };

    // this function wraps the chai plugin into different formats to make sure it works when loaded in the 4 different
    // scenarios listed above.
    var wrap = function(plugin) {
        /* global module:false, define:false */
        /* global jQuery, axs, chai */
        if (typeof require === 'function' &&
            typeof exports === 'object' &&
            typeof module === 'object') {
            // **browserify or raptorjs stack**
            module.exports = require('./browser');
        } else if (typeof define === 'function' && define.amd) {
            // **AMD:** Assumes importing `chai`, `jquery` and `accessibility-developer-tools (axs)`. Returns a
            // function to inject with `chai.use()`.
            define([
                'jquery',
                'auditRunner'
            ], function($, auditRunner) {
                return function(chai, utils) {
                    return plugin(chai, utils, {
                        $: $,
                        auditRunner: auditRunner
                    });
                };
            });
        } else {
            // __Other environment__ (usually <script> tag): plug in to global chai instance directly.
            chai.use(function(chai, utils) {
                return plugin(chai, utils, {
                    $: jQuery
                });
            });
        }
    };
    // Hook it all together.
    wrap(chaiAccessibility);
}());