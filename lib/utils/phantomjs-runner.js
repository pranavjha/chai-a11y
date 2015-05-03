// ## the phantomjs runner
// this script runs accessibility tests on an html file using phantomJS
'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs');
var q = require('q');
// runs accessibility tests on an html file using phantomJS and returns a promise that resolves when the tests are
// complete
//
// **Parameters**
//  - `url` the absolute path of the html file
//  - `opts` options passed to phantomJS runner. can contain width and height of browser
module.exports = function (url, opts) {
  var deferred = q.defer();
  opts = opts || {};
  opts.width = opts.width || 1024;
  opts.width = opts.width || 768;
  opts.url = 'file://' + url;
  execFile(phantomjs.path, [
    path.join(__dirname, 'a11y-auditor.js'),
    JSON.stringify(opts),
    '--ignore-ssl-errors=true',
    '--ssl-protocol=tlsv1',
    '--local-to-remote-url-access=true'
  ], {
    cwd: path.join(__dirname, '../../')
  }, function (err, stdout) {
    if (err) {
      // reject the promise in case of error
      return deferred.reject(err);
    }
    // else, resolve it with the JSON response
    deferred.resolve(JSON.parse(stdout));
  });
  return deferred.promise;
};
