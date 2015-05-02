(function () {
  'use strict';
  var stringifyResponse = function (response) {
    var message = '';
    response.filter(function (item) {
      return (item.result === 'FAIL');
    }).forEach(function (item) {
      message += ('\nrule name:       ' + item.rule.name);
      message += ('\nrule severity:   ' + item.rule.severity);
      message += ('\nrule code:       ' + item.rule.code);
      message += ('\nrule heading:    ' + item.rule.heading);
      message += ('\nrule url:        ' + item.rule.url);
      item.elements.forEach(function (el, index) {
        message += ('\nviolation #' + index + ':    ' + el.innerHTML);
      });
      message += '\n';
    });
    return message;
  };
  // modules will have keys: $ and axs
  var chaiAccessibility = function (chai, utils, modules) {
    /* global document */
    var $ = modules.$;
    var axs = modules.axs;
    var Assertion = chai.Assertion;
    Assertion.addMethod('accessible', function () {
      // get the modules for use
      var element = $(this._obj);
      var id = element.attr('id') || ('_a_id_' + parseInt(Math.random() * 999999999));
      element.attr('id', id);
      if (!$.contains(document, element)) {
        // if the element is not in the dom, we append it into the DOM
        element.appendTo($('body'));
      }
      var configuration = new axs.AuditConfiguration();
      configuration.scope = element.get(0);
      configuration.showUnsupportedRulesWarning = false;
      var response = axs.Audit.run(configuration);
      var message = stringifyResponse(response);
      if (message) {
        throw message;
      }
    });
  };

  var wrap = function (plugin) {
    /* global module:false, define:false */
    /* global jQuery, axs, chai */
    if (typeof require === 'function' &&
      typeof exports === 'object' &&
      typeof module === 'object') {
      if (typeof window !== 'undefined') {
        // browserify or raptorjs stack
        module.exports = require('./browser');
      } else {
        // pure nodejs stack
        // this is for tricking browserify / raptorJS
        var trickRequire = require;
        module.exports = trickRequire('./node');
      }
    } else if (typeof define === 'function' && define.amd) {
      // AMD: Assumes importing `chai`, `jquery` and `accessibility-developer-tools (axs)`. Returns a function to
      // inject with `chai.use()`.
      define([
        '$'
      ], function ($) {
        return function (chai, utils) {
          return plugin(chai, utils, {
            $: $,
            axs: axs
          });
        };
      });
    } else {
      // Other environment (usually <script> tag): plug in to global chai instance directly.
      chai.use(function (chai, utils) {
        return plugin(chai, utils, {
          $: jQuery,
          axs: axs
        });
      });
    }
  };
  // Hook it all together.
  wrap(chaiAccessibility);
}());