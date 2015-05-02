'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');
var q = require('q');
module.exports = function chaiAccessibility(chai) {
  var Assertion = chai.Assertion;
  Assertion.addMethod('accessible', function () {
    var element = this._obj;
    var fileName = path.join(os.tmpdir() + 'file_' + parseInt(Math.random() * 99999999) + '.html');
    var contents = '<html><head><title>Sample A11y Check</title><body>' + element + '</body></head>';
    return q.nfcall(fs.writeFile, fileName, contents).then(function () {
      return require('./utils/phantomjs-runner')(fileName);
    }).then(function (response) {
      var message = require('./utils/stringify-response')(response);
      if (!message) {
        return 'OK'
      }
      throw message;
    });
  });
};