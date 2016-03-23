// ## plugin implementation for node.
'use strict';
module.exports = function chaiAccessibility(chai) {
    var Assertion = chai.Assertion;
    Assertion.addMethod('accessible', function(config, auditConfig) {
        // extract the DOM element which will be a string in this case
        var element = this._obj;
        // get the config object
        var normalizedConfig = require('./utils/normalize-config')(config);
        // get the value of port
        var port = normalizedConfig.port || 4567;
        // create a temporary http server
        var server = require('http').createServer(function(request, response) {
            response.writeHeader(200, {
                'Content-Type': 'text/html'
            });
            response.write('<html lang="en"><head><title>Sample A11y Check</title><body>' + element + '</body></head>');
            response.end();
        }).listen(port);
        // run the file on phantomJS to test accessibility
        return require('./utils/phantomjs-runner')(
            ('http://localhost:' + port),
            normalizedConfig,
            auditConfig
        ).then(
            function(response) {
                // parse the response and check for any errors
                var issueCount = require('./utils/stringify-response')(response);
                // if there is no error, the test passes
                if (!issueCount) {
                    return 'OK';
                }
                // else, the error is thrown
                throw new Error(issueCount + ' issues found!');
            }
        ).finally(function() {
            // shut down the server after the test
            server.close();

        });
    });
};
