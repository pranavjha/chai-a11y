// ## plugin implementation for node.
'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');
var q = require('q');

module.exports = function chaiAccessibility(chai) {
  var Assertion = chai.Assertion;
  Assertion.addMethod('accessible', function (config) {
    // extract the DOM element which will be a string in this case
    var element = this._obj;
    // we create a temporary file with the passed html string to run accessibility audits
    var fileName = path.join(os.tmpdir() + 'file_' + parseInt(Math.random() * 99999999) + '.html');
    var contents = '<html><head><title>Sample A11y Check</title><body>' + element + '</body></head>';
    return q.nfcall(fs.writeFile, fileName, contents).then(function () {
      // run the file on phantomJS to test accessibility
      return require('./utils/phantomjs-runner')(fileName, require('./utils/normalize-config')(config));
    }).then(function (response) {
      // parse the response and check for any errors
      var message = require('./utils/stringify-response')(response);
      // if there is no error, the test passes
      if (!message) {
        return 'OK';
      }
      // else, the error is thrown
      throw message;
    });
  });
};