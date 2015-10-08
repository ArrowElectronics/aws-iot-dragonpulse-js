'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-network-transfer';

var dragonpulse = require('dragonpulse-lib');

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.transfer(event, 'network',
        function(err, response) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed();
            }
        }
    );
};
