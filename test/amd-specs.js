/* globals define, describe, it */
define([
    'chai',
    'chaiA11y',
    'jquery'
], function(chai, chaiA11y, $) {
    'use strict';
    chai.use(chaiA11y);
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
        it('should not pollute the DOM', function() {
            return expect('<button id="temp_id">temp</button>').to.be.accessible().then(function() {
                return expect($('#temp_id').size()).to.eql(0);
            });
        });
        it('should not move or delete an existing element', function() {
            var btn = $('<button id="temp_id">temp</button>');
            $('body').append($('<div id="temp_div"></div>').append(btn));
            return expect(btn).to.be.accessible().then(function() {
                expect($('#temp_div > #temp_id').size()).to.eql(1);
                $('#temp_id').remove();
            });
        });
    });
});
