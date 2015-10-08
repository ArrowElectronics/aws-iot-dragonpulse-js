'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-network-create';

var dragonpulse = require('dragonpulse-lib');
var network = require('dragonpulse-things-monitor-network-lib');

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "DragonPulseThingsMonitorNetworkCreate",
    type: "object",
    properties: {
        thingId: {
            type: "string"
        },
        timestamp: {
            type: "number"
        },
        totalSendRate: {
            type: "number"
        },
        nInterface: {
            type: "string"
        },
        cummulative: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
                type: "number"
            }
        },
        counter: {
            type: "number"
        },
        totalSendRecvRate: {
            type: "number"
        },
        macAddress: {
            type: "string",
            pattern: "([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}"
        },
        peakRate: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
                type: "number"
            }
        },
        totalRecvRate: {
            type: "number"
        },
        ipAddress: {
            type: "string",
            pattern: "([0-9]{1,3}\.){3}[0-9]{1,3}"
        }
    },
    required: [ "thingId", "timestamp", "totalSendRate", "nInterface", "cummulative", "counter", "totalSendRecvRate",
        "macAddress", "peakRate", "totalRecvRate", "ipAddress"]
};

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.create(event, requestSchema, network.table,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed();
            }
        }
    );
};
