'use strict';
module.exports = function (response) {
  var message = '';
  response.filter(function (item) {
    return (item.result === 'FAIL');
  }).forEach(function (item) {
    message += ('\nrule name:       ' + item.rule.name);
    message += ('\nrule severity:   ' + item.rule.severity);
    message += ('\nrule code:       ' + item.rule.code);
    message += ('\nrule heading:    ' + item.rule.heading);
    message += ('\nrule url:        ' + item.rule.url);
    item.elements.forEach(function (el, index) {
      message += ('\nviolation #' + index + ':    ' + el.innerHTML);
    });
    message += '\n';
  });
  return message;
};