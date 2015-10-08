'use strict';

var FUNC_NAME = 'dragonpulse-things-monitor-process-create';

var dragonpulse = require('dragonpulse-lib');
var process = require('dragonpulse-things-monitor-process-lib');

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "DragonPulseThingsMonitorProcessCreate",
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
        loadAvg: {
            "$ref": "#/definitions/sample"
        },
        cpuUsage: {
            "$ref": "#/definitions/cpuUsage"
        },
        tasks: {
            "$ref": "#/definitions/sample"
        },
        memory: {
            "$ref": "#/definitions/sample"
        },
        processList: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    pid: {
                        type: "string",
                        pattern: "[0-9]+"
                    },
                    command: {
                        type: "string"
                    },
                    cpu: {
                        type: "string",
                        pattern: "[0-9\.]+"
                    },
                    ttime: {
                        type: "string",
                        pattern: "[0-9]+:[0-9]{2}.[0-9]{2}"
                    },
                    memory: {
                        type: "string",
                        pattern: "[0-9]+"
                    },
                    state: {
                        enum: [ "running", "sleeping", "stuck" ]
                    },
                    user: {
                        type: "string"
                    }
                },
                required: [ "pid", "command", "cpu", "ttime", "memory", "state", "user" ]
            }
        }
    },
    definitions: {
        sample: {
            type: "array",
            items: {
                type: "string",
                pattern: "[0-9\.]+"
            }
        },
        cpuUsage: {
            type: "array",
            items: {
                type: "string",
                pattern: "[0-9\.%]"
            }
        }
    },
    required: [ "thingId", "timestamp", "counter", "loadAvg", "cpuUsage", "tasks", "memory", "processList" ]
};

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    dragonpulse.create(event, requestSchema, process.table,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed();
            }
        }
    );
};
