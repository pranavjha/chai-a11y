// ## the phantomjs runner
// this script runs accessibility tests on an html file using phantomJS
'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs');
var Promise = require('bluebird');
// runs accessibility tests on an html file using phantomJS and returns a promise that resolves when the tests are
// complete
//
// **Parameters**
//  - `url` the absolute path of the html file
//  - `config` options passed to phantomJS runner. can contain width and height of browser
module.exports = function(url, config) {
    return new Promise(function(resolve, reject) {
        config = config || {};
        config.width = config.width || 1024;
        config.height = config.height || 768;
        config.url = url;
        config.auditorPath = require.resolve('accessibility-developer-tools/dist/js/axs_testing.js');
        execFile(phantomjs.path, [
            path.join(__dirname, 'a11y-auditor.js'),
            JSON.stringify(config),
            '--ignore-ssl-errors=true',
            '--ssl-protocol=tlsv1',
            '--local-to-remote-url-access=true'
        ], {
            cwd: path.join(__dirname, '../../')
        }, function(err, stdout) {
            if (err) {
                // reject the promise in case of error
                return reject(err);
            }
            // else, resolve it with the JSON response
            resolve(JSON.parse(stdout));
        });
    });
};
