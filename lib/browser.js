/* globals window, document, axs */
// ## plugin implementation for browsers.
'use strict';
var $ = require('jquery');

// this function loads accessibility developer tools in the browser environment by injecting a script tag if it doesn't
// already exist. Once it ensures that the accessibility tool is loaded in the browser, it calls the callback
var loadPlugin = function (cb, eb) {
  if (!window.axs) {
    // add the accessibility tool if not present
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text\/javascript';
    scriptTag.onerror = eb;
    // call the callback once the script loads
    scriptTag.onload = cb;
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
    // [why rawgit.com instead of raw.github.com]
    // (http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github)
    scriptTag.src = '//rawgit.com/GoogleChrome/accessibility-developer-tools/stable/dist/js/axs_testing.js';
  } else {
    // if accessibility tools are present, call the callback directly
    window.setTimeout(cb);
  }
};

// actual plugin implementation
module.exports = function chaiAccessibility(chai) {
  var Assertion = chai.Assertion;
  Assertion.addMethod('accessible', function (config) {
    var deferred = $.Deferred();
    // this boolean is true if the element send was not a part of the DOM and is appended to the DOM by this assertion
    // library
    var isAppended = false;
    // fetch the element, Element here can be a DOM element, a jQuery element or a HTML String. So, we wrap it in a
    // jQuery object to normalize
    var element = $(this._obj);
    if (!$.contains(document, element)) {
      // if the element is not in the dom, we append it into the DOM
      element.appendTo($('body'));
      isAppended = true;
    }
    loadPlugin(function () {
      // Run the auditor
      var configuration = new axs.AuditConfiguration();
      configuration.scope = element.get(0);
      configuration.showUnsupportedRulesWarning = false;
      // normalize config
      config = require('./utils/normalize-config')(config);
      config.ignore.forEach(function (ignores) {
        configuration.ignoreSelectors(ignores[0], ignores[1] || '*');
      });
      var response = axs.Audit.run(configuration);
      // parse the audit results
      var message = require('./utils/stringify-response')(response);
      // if the element was appended in this assertion, detach it
      if (isAppended) {
        element.detach();
      }
      if (!message) {
        // if the audit is successful, the test passes
        deferred.resolve('OK');
      } else {
        // if the audit fails, the test fails
        deferred.reject(message);
      }
    }, function (e) {
      // fail the test if the plugin doesn't load
      deferred.reject(e);
    });
    return deferred.promise();
  });
};