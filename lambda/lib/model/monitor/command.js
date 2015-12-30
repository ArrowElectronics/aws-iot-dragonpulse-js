module.exports = {
  "schema": {
    "id": "/command/monitor",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "action": {
        "enum": [ "create", "retrieve" ]
      },
      "type": {
        "enum": [ "disk", "general", "network", "process" ]
      },
      "message": {
        "type": "object"
      }
    },
    "required": [ "action", "type", "message" ],
    "additionalProperties": false
  }
};