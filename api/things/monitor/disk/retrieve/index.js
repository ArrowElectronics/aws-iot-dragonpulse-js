'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-disk-retrieve';

var dragonpulse = require('dragonpulse-lib');
var disk = require('dragonpulse-things-monitor-disk-lib');

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    var thingId = event.thingId;
    dragonpulse.retrieve(event, disk.table, 1,
        function (err, data) {
            if (err) {
                return context.fail(err);
            } else {
                if (data.length > 0) {
                    return context.succeed(data[0][disk.data]);
                }

                return context.fail('ResourceNotFoundException:  No disk data found for thing ' + thingId);
            }
        }
    );
};
