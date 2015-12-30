var thing = require('./../../../entity/thing');
var monitor = require('./../../../entity/monitor');
var general = require('./../../../entity/general');

module.exports = {
  "entities": {
    "thing": thing,
    "monitor": monitor,
    "general": general
  },
  "schema": {
    "id": "/request/monitor-general-create",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "thingId": {
        "$ref": "/entity/thing#/definitions/thingId"
      },
      "timestamp": {
        "$ref": "/entity/monitor#/definitions/timestamp"
      },
      "deviceType": {
        "$ref": "/entity/monitor/general#/definitions/deviceType"
      },
      "os": {
        "$ref": "/entity/monitor/general#/definitions/os"
      },
      "osVariant": {
        "$ref": "/entity/monitor/general#/definitions/osVariant"
      },
      "osVersion": {
        "$ref": "/entity/monitor/general#/definitions/osVersion"
      },
      "osCodename": {
        "$ref": "/entity/monitor/general#/definitions/osCodename"
      },
      "build": {
        "$ref": "/entity/monitor/general#/definitions/build"
      },
      "architecture": {
        "$ref": "/entity/monitor/general#/definitions/architecture"
      }
    },
    "required": [ "thingId", "timestamp", "deviceType", "os", "osVersion", "architecture" ],
    "additionalProperties": false
  }
};
