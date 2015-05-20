describe('chai a11y', function () {
  'use strict';
  it('should be able to validate an html string', function () {
    return expect('<button>Abacus</button>').to.be.accessible();
  });
  it('should be able to ignore one rule', function () {
    return expect('<button></button>').to.be.accessible({
      ignore: 'controlsWithoutLabel'
    });
  });
  it('should be able to ignore stuff with rulename', function () {
    return expect('<button></button>').to.be.accessible({
      ignore: [
        'controlsWithoutLabel'
      ]
    });
  });
  it('should be able to ignore stuff using selectors', function () {
    return expect('<button></button>').to.be.accessible({
      ignore: [
        'controlsWithoutLabel',
        'button'
      ]
    });
  });
});