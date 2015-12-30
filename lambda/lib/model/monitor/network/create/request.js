var thing = require('./../../../entity/thing');
var monitor = require('./../../../entity/monitor');
var network = require('./../../../entity/network');

module.exports = {
  "entities": {
    "thing": thing,
    "monitor": monitor,
    "network": network
  },
  "schema": {
    "id": "/request/monitor-network-create",
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
      "totalSendRate": {
        "$ref": "/entity/monitor/network#/definitions/totalSendRate"
      },
      "nInterface": {
        "$ref": "/entity/monitor/network#/definitions/nInterface"
      },
      "cummulative": {
        "$ref": "/entity/monitor/network#/definitions/cummulative"
      },
      "totalSendRecvRate": {
        "$ref": "/entity/monitor/network#/definitions/totalSendRecvRate"
      },
      "macAddress": {
        "$ref": "/entity/monitor/network#/definitions/macAddress"
      },
      "peakRate": {
        "$ref": "/entity/monitor/network#/definitions/peakRate"
      },
      "totalRecvRate": {
        "$ref": "/entity/monitor/network#/definitions/totalRecvRate"
      },
      "ipAddress": {
        "$ref": "/entity/monitor/network#/definitions/ipAddress"
      }
    },
    "required": [ "thingId", "timestamp", "counter", "totalSendRate", "nInterface", "cummulative", "totalSendRecvRate",
      "macAddress", "peakRate", "totalRecvRate", "ipAddress"],
    "additionalProperties": false
  }
};
