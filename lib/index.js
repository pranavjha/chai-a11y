(function () {
  'use strict';
  var root = this;
  // modules will have keys: vow and axs
  function chaiAccessibility(chai, utils, modules) {
    var Assertion = chai.Assertion;
    Assertion.addMethod('accessible', function () {
      // get the modules for use
      var $ = modules.$;
      var axs = modules.axs;
      var element = $(this._obj);
      var id = element.attr('id') || ('_a_id_' + parseInt(Math.random() * 999999999));
      element.attr('id', id);
      /* globals document, axs */
      if (!$.contains(document, element)) {
        // if the element is not in the dom, we append it into the DOM
        element.appendTo($('body'));
      }
      var configuration = new axs.AuditConfiguration();
      configuration.scope = document.querySelector('#' + id);  // or however you wish to choose your scope element
      axs.Audit.run(configuration);
    });
  }

  function wrap(plugin) {
    /* global module:false, define:false */
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
        module.exports = trickRequire('./lib/node');
      }
    } else if (typeof define === 'function' && define.amd) {
      // AMD: Assumes importing `chai`, `jquery` and `accessibility-developer-tools (axs)`. Returns a function to
      // inject with `chai.use()`.
      define([
        'vow',
        '$'
      ], function (vow, $) {
        return function (chai, utils) {
          return plugin(chai, utils, {
            $: $,
            axs: axs
          });
        };
      });
    } else {
      // Other environment (usually <script> tag): plug in to global chai instance directly.
      root.chai.use(function (chai, utils) {
        return plugin(chai, utils, {
          $: root.jQuery,
          axs: root.axs
        });
      });
    }
  }

  // Hook it all together.
  wrap(chaiAccessibility);
}());