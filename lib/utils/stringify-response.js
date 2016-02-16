// creates a message string from the response object received from the axs audit
'use strict';
module.exports = function(response) {
    var messageCount = 0;
    Array.prototype.concat.apply([], Object.keys(response).map(function(ruleKey) {
        return response[ruleKey];
    })).filter(function(item) {
        // filter all the FAILed cases
        return (!item.errMsg.result);
    }).forEach(function(item) {
        messageCount = messageCount + 1;
        // get the important information in the string to be returned
        console.log('Description:     ' + item.description);
        console.log('Error Message:   ' + item.errMsg);
        console.log('Rule ID:         ' + item.ruleID);
        console.log('Severity:        ' + item.severityEnum);
        console.log('');
    });
    return messageCount;
};
