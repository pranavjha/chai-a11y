'use strict';
module.exports = function (response) {
  var message = '';
  response.filter(function (item) {
    return (item.result === axs.constants.AuditResult.FAIL);
  }).forEach(function (item) {
    message += ('\n\nrule name:       ' + item.rule.name);
    message += ('\nrule severity:   ' + item.rule.severity);
    message += ('\nrule code:       ' + item.rule.code);
    message += ('\nrule heading:    ' + item.rule.heading);
    message += ('\nrule url:        ' + item.rule.url);
    item.elements.forEach(function (el, index) {
      message += ('\nviolation #' + index + ':    ' + el.innerHTML);
    });
  });
  return message;
};