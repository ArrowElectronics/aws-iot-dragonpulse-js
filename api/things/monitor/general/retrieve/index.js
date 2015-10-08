'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-general-retrieve';

var dragonpulse = require('dragonpulse-lib');
var general = require('dragonpulse-things-monitor-general-lib');

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.retrieve(event, general.table, 1,
        function (err, data) {
            if (err) {
                return context.fail(err);
            } else {
                if (data.length > 0) {
                    return context.succeed(data[0][general.data]);
                }

                return context.fail('ResourceNotFoundException:  No disk data found for thing ' + event.thingId);
            }
        }
    );
};
