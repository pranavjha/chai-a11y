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
        var port = undefined;
		
		var server = undefined;
		var url = undefined;
		
		if(normalizedConfig.url) {
			//url is specified
			port = normalizedConfig.port || 80;
			console.log("url was specified");
			url = normalizedConfig.url + ":" + port;
		}
		else {
			// create a temporary http server
			port = normalizedConfig.port || 4567;
			server = require('http').createServer(function(request, response) {
            response.writeHeader(200, {
					'Content-Type': 'text/html'
				});
				response.write('<html lang="en"><head><title>Sample A11y Check</title><body>' + element + '</body></head>');
				response.end();
			}).listen(port);
			url = 'http://localhost:' + port;
		}
		
        // run the file on phantomJS to test accessibility
        return require('./utils/phantomjs-runner')(
            (url),
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
			if(server) {
				server.close();
			}
        });
    });
};
