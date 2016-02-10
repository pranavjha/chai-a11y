/* globals describe, it */
'use strict';
var chai = require('chai');
chai.use(require('../' + (process.env.APP_DIR_FOR_CODE_COVERAGE || '') + 'lib/node'));
var expect = chai.expect;
describe('chai a11y', function() {
    it('should be able to validate an html string', function() {
        return expect('<button>Abacus</button>').to.be.accessible();
    });
    it('should be able to ignore one rule', function() {
        return expect('<button></button>').to.be.accessible({
            ignore: 'controlsWithoutLabel'
        });
    });
    it('should be able to ignore stuff with rulename', function() {
        return expect('<button></button>').to.be.accessible({
            ignore: [
                'controlsWithoutLabel'
            ]
        });
    });
    it('should be able to ignore stuff using selectors', function() {
        return expect('<button></button>').to.be.accessible({
            ignore: [
                'controlsWithoutLabel',
                'button'
            ]
        });
    });
});