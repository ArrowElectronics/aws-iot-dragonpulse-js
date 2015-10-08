'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-general-create';

var dragonpulse = require('dragonpulse-lib');
var general = require('dragonpulse-things-monitor-general-lib');

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "DragonPulseThingsMonitorGeneralCreate",
    type: "object",
    properties: {
        thingId: {
            type: "string"
        },
        timestamp: {
            type: "number"
        },
        deviceType: {
            type: "string"
        },
        os: {
            type: "string"
        },
        osVariant: {
            type: "string"
        },
        osVersion: {
            type: "string"
        },
        osCodename: {
            type: "string"
        },
        build: {
            type: "string"
        },
        architecture: {
            type: "string"
        }
    },
    required: [ "thingId", "timestamp", "deviceType", "os", "osVersion", "architecture" ]
};

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.create(event, requestSchema, general.table,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed();
            }
        }
    );
};
