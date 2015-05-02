'use strict';
var $ = require('jquery');
var loadPlugin = function (cb) {
  if (!window.axs) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute(
      'src',
      '//raw.github.com/GoogleChrome/accessibility-developer-tools/stable/dist/js/axs_testing.js'
    );
    if (scriptTag.addEventListener) {
      scriptTag.addEventListener('load', function () {
        return cb();
      }, false);
    } else if (scriptTag.attachEvent) {
      scriptTag.attachEvent('onload', function () {
        return cb();
      });
    }
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
  } else {
    window.setTimeout(cb);
  }
};
module.exports = function chaiAccessibility(chai) {
  var Assertion = chai.Assertion;
  Assertion.addMethod('accessible', function () {
    var deferred = $.Deferred();
    // get the modules for use
    var element = $(this._obj);
    var id = element.attr('id') || ('_a_id_' + parseInt(Math.random() * 999999999));
    element.attr('id', id);
    if (!$.contains(document, element)) {
      // if the element is not in the dom, we append it into the DOM
      element.appendTo($('body'));
    }
    loadPlugin(function () {
      var configuration = new axs.AuditConfiguration();
      configuration.scope = element.get(0);
      configuration.showUnsupportedRulesWarning = false;
      var response = axs.Audit.run(configuration);
      var message = require('./stringify-response')(response);
      if (!message) {
        deferred.resolve('OK');
      } else {
        deferred.reject(message);
      }
    }, function (e) {
      deferred.reject(e);
    });
    return deferred.promise();
  });
};