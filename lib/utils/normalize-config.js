// ## normalizing the configuration
'use strict';
// This function normalizes the config object.
module.exports = function(config) {
    config = config || {};
    config.ignore = config.ignore || {};
    if (typeof config.ignore === 'string' ||
        config.ignore instanceof Array) {
        config.ignore = {
            '*': config.ignore
        };
    }
    Object.keys(config.ignore).forEach(function(selector) {
        if (typeof config.ignore[selector] === 'string') {
            config.ignore[selector] = [
                config.ignore[selector]
            ];
        }
    });
    return config;
};
