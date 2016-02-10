// ## normalizing the configuration
'use strict';
// This function normalizes the config object.
module.exports = function(config) {
    config = config || {};
    config.ignore = config.ignore || [];
    if (typeof config.ignore === 'string') {
        config.ignore = [
            config.ignore
        ];
    }
    config.ignore = config.ignore.map(function(singleIgnore) {
        if (typeof singleIgnore === 'string') {
            return [
                singleIgnore,
                '*'
            ];
        }
        return singleIgnore;
    });
    return config;
};