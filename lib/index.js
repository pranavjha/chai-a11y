// ## Chai Accessibility Plugin
//
// Here, we make sure that the plugin works in the below 3 scenarios:
//
//  - When run from NodeJS
//  - When run in a browser, transformed using browserify
//  - When used in a browser using amd like requirejs
//  - When included as a script tag on the page
(function () {
  'use strict';
  // This function normalizes the config object.
  var normalizeConfig = function (config) {
    config = config || {};
    config.ignore = config.ignore || [];
    if (typeof config.ignore === 'string') {
      config.ignore = [
        config.ignore
      ];
    }
    config.ignore = config.ignore.map(function (singleIgnore) {
      if (typeof singleIgnore === 'string') {
        return [
          singleIgnore,
          '*'
        ];
      }
      return singleIgnore;
    });
    return config;
  };
  // creates a message string from the response object received from the axs audit
  var stringifyResponse = function (response) {
    var message = '';
    response.filter(function (item) {
      return (item.result === 'FAIL');
    }).forEach(function (item) {
      // get the important information in the string to be returned
      message += ('\nrule name:       ' + item.rule.name);
      message += ('\nrule severity:   ' + item.rule.severity);
      message += ('\nrule code:       ' + item.rule.code);
      message += ('\nrule heading:    ' + item.rule.heading);
      message += ('\nrule url:        ' + item.rule.url);
      item.elements.forEach(function (el, index) {
        message += ('\nviolation #' + index + ':    ' + el.outerHTML);
      });
      message += '\n';
    });
    return message;
  };
  // modules will have keys: $ and axs
  var chaiAccessibility = function (chai, utils, modules) {
    /* global document */
    var $ = modules.$;
    var Assertion = chai.Assertion;
    Assertion.addMethod('accessible', function (config) {
      // get the modules for use
      var element = $(this._obj);
      // check if the element is a part of DOM
      var isOrphan = !$.contains(document, element.get(0));
      if (isOrphan) {
        // if the element is not in the dom, we append it into the DOM
        element.appendTo($('body'));
      }
      var deferred = $.Deferred();
      loadPlugin(function () {
        /* global axs */
        // Run the auditor
        var configuration = new axs.AuditConfiguration();
        configuration.scope = element.get(0);
        configuration.showUnsupportedRulesWarning = false;
        // normalize config
        config = normalizeConfig(config);
        config.ignore.forEach(function (ignores) {
          configuration.ignoreSelectors(ignores[0], ignores[1] || '*');
        });
        var response = axs.Audit.run(configuration);
        // parse the audit results
        var message = stringifyResponse(response);
        if (isOrphan) {
          // if the element was not in the dom, we remove it
          element.remove();
        }
        if (message) {
          deferred.reject(message);
        } else {
          deferred.resolve('OK');
        }
      }, function (e) {
        deferred.reject(e);
      });
      return deferred.promise();
    });
  };

// this function loads accessibility developer tools in the browser environment by injecting a script tag if it doesn't
// already exist. Once it ensures that the accessibility tool is loaded in the browser, it calls the callback
  var loadPlugin = function (cb, eb) {
    /* global window */
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
      // if accessibility tools are present, call the callback directly, but in a different call stack
      window.setTimeout(cb);
    }
  };

  // this function wraps the chai plugin into different formats to make sure it works when loaded in the 4 different
  // scenarios listed above.
  var wrap = function (plugin) {
    /* global module:false, define:false */
    /* global jQuery, axs, chai */
    if (typeof require === 'function' &&
      typeof exports === 'object' &&
      typeof module === 'object') {
      // **browserify or raptorjs stack**
      module.exports = require('./browser');
    } else if (typeof define === 'function' && define.amd) {
      // **AMD:** Assumes importing `chai`, `jquery` and `accessibility-developer-tools (axs)`. Returns a function to
      // inject with `chai.use()`.
      define([
        'jquery'
      ], function ($) {
        return function (chai, utils) {
          return plugin(chai, utils, {
            $: $
          });
        };
      });
    } else {
      // **Other environment** (usually <script> tag): plug in to global chai instance directly.
      chai.use(function (chai, utils) {
        return plugin(chai, utils, {
          $: jQuery
        });
      });
    }
  };
  // Hook it all together.
  wrap(chaiAccessibility);
}());