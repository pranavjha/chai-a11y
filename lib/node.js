'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');
var q = require('q');
var a11y = require('a11y');
module.exports = function chaiAccessibility(chai) {
  var Assertion = chai.Assertion;
  Assertion.addMethod('accessible', function () {
    var element = this._obj;
    var fileName = path.join(os.tmpdir() + 'file_' + parseInt(Math.random() * 99999999) + '.html');
    var contents = '<html><head><title>Sample A11y Check</title><body>' + element + '</body></head>';
    return q.nfcall(fs.writeFile, fileName, contents).then(function () {
      var deferred = q.defer();
      a11y(fileName, deferred.makeNodeResolver());
      return deferred.promise;
    }).then(function (response) {
      var message = require('./stringify-response')(response);
      if (!message) {
        return 'OK'
      }
      throw message;
    });
  });
};