var thing = require('./../../../entity/thing');
var monitor = require('./../../../entity/monitor');
var process = require('./../../../entity/process');

module.exports = {
  "entities": {
    "thing": thing,
    "monitor": monitor,
    "process": process
  },
  "schema": {
    "id": "/request/monitor-process-create",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "thingId": {
        "$ref": "/entity/thing#/definitions/thingId"
      },
      "timestamp": {
        "$ref": "/entity/monitor#/definitions/timestamp"
      },
      "counter": {
        "$ref": "/entity/monitor#/definitions/counter"
      },
      "loadAvg": {
        "$ref": "/entity/monitor/process#/definitions/loadAvg"
      },
      "cpuUsage": {
        "$ref": "/entity/monitor/process#/definitions/cpuUsage"
      },
      "tasks": {
        "$ref": "/entity/monitor/process#/definitions/tasks"
      },
      "memory": {
        "$ref": "/entity/monitor/process#/definitions/memory"
      },
      "processList": {
        "$ref": "/entity/monitor/process#/definitions/processList"
      }
    },
    "required": [ "thingId", "timestamp", "counter", "loadAvg", "cpuUsage", "tasks", "memory", "processList" ],
    "additionalProperties": false
  }
};
