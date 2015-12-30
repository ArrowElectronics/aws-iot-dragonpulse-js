var thing = require('./../../../entity/thing');

module.exports = {
  "entities": {
    "thing": thing
  },
  "schema": {
    "id": "/request/monitor-network-retrieve",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "thingId": {
        "$ref": "/entity/thing#/definitions/thingId"
      }
    },
    "required": [
      "thingId"
    ],
    "additionalProperties": false
  }
};