var thing = require('./../../../entity/thing');
var monitor = require('./../../../entity/monitor');
var disk = require('./../../../entity/disk');

module.exports = {
  "entities": {
    "thing": thing,
    "monitor": monitor,
    "disk": disk
  },
  "schema": {
    "id": "/response/monitor-disk-retrieve",
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
      "directoryList": {
        "$ref": "/entity/monitor/disk#/definitions/filesystems"
      }
    },
    "required": [
      "thingId", "timestamp", "counter", "directoryList"
    ],
    "additionalProperties": false
  }
};