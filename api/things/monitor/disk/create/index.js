'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-disk-create';

var dragonpulse = require('dragonpulse-lib');
var disk = require('dragonpulse-things-monitor-disk-lib');

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "DragonPulseThingsMonitorDiskCreate",
    type: "object",
    properties: {
        thingId: {
            type: "string"
        },
        timestamp: {
            type: "number"
        },
        counter: {
            type: "number"
        },
        directoryList: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    filesystem: {
                        type: "string",
                        pattern: "[/:a-zA-Z0-9]+"
                    },
                    fSize: {
                        type: "number"
                    },
                    used: {
                        type: "number"
                    },
                    available: {
                        type: "number"
                    },
                    usage: {
                        type: "string",
                        pattern: "[0-9]{1,3}%"
                    },
                    mounted: {
                        type: "string",
                        pattern: "(/[a-zA-Z0-9_]*)+"
                    }
                },
                required: [ "filesystem", "fSize", "used", "available", "usage", "mounted" ]
            }
        }
    },
    required: [ "thingId", "timestamp", "counter", "directoryList" ]
};

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.create(event, requestSchema, disk.table,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed();
            }
        }
    );
};
