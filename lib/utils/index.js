'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs');
var q = require('q');
module.exports = function (url, opts) {
  var deferred = q.defer();
  opts = opts || {};
  opts.width = opts.width || 1024;
  opts.width = opts.width || 768;
  opts.url = 'file://' + url;
  console.log(opts);
  execFile(phantomjs.path, [
    path.join(__dirname, 'audits.js'),
    JSON.stringify(opts),
    '--ignore-ssl-errors=true',
    '--ssl-protocol=tlsv1',
    '--local-to-remote-url-access=true'
  ], {
    cwd: path.join(__dirname, '../../')
  }, function (err, stdout) {
    if (err) {
      return deferred.reject(err);
    }
    deferred.resolve(JSON.parse(stdout));
  });
  return deferred.promise;
};
