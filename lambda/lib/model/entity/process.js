module.exports = {
  "id": "/entity/monitor/process",
  "definitions": {
    "loadAvg": {
      "$ref": "#/definitions/sample"
    },
    "cpuUsage": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[0-9\.%]$"
      }
    },
    "tasks": {
      "$ref": "#/definitions/sample"
    },
    "memory": {
      "$ref": "#/definitions/sample"
    },
    "processList": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "pid": {
            "type": "string",
            "pattern": "^[0-9]+$"
          },
          "command": {
            "type": "string"
          },
          "cpu": {
            "type": "string",
            "pattern": "^[0-9\.]+$"
          },
          "ttime": {
            "type": "string",
            "pattern": "^[0-9]+:[0-9]{2}.[0-9]{2}$"
          },
          "memory": {
            "type": "string",
            "pattern": "^[0-9]+$"
          },
          "state": {
            "enum": [ "running", "sleeping", "stuck" ]
          },
          "user": {
            "type": "string"
          }
        },
        "required": [ "pid", "command", "cpu", "ttime", "memory", "state", "user" ],
        "additionalProperties": false
      }
    },
    "sample": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "[0-9\.]+"
      }
    }
  }
};