/* globals window */
'use strict';
var allTestFiles = [];
var TEST_REGEXP = /\/base\/test\/.*\-specs.js$/;
Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});
require.config({
    paths: {
        jquery: '../node_modules/jquery/dist/jquery',
        chai: '../node_modules/chai/chai',
        auditRunner: '../node_modules/a11y-auditor/dist/a11y-auditor',
        chaiA11y: '../lib/index'
    },
    baseUrl: '/base/src',
    deps: allTestFiles,
    // Set tests to start run once RequireJS configuration is done.
    callback: window.__karma__.start
});