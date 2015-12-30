module.exports = {
  "id": "/entity/monitor/disk",
  "definitions": {
    "filesystems": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "filesystem": {
            "type": "string",
            "pattern": "[/:a-zA-Z0-9]+"
          },
          "fSize": {
            "type": "number"
          },
          "used": {
            "type": "number"
          },
          "available": {
            "type": "number"
          },
          "usage": {
            "type": "string",
            "pattern": "[0-9]{1,3}%"
          },
          "mounted": {
            "type": "string",
            "pattern": "(/[a-zA-Z0-9_]*)+"
          }
        },
        "required": [ "filesystem", "fSize", "used", "available", "usage", "mounted" ],
        "additionalProperties": false
      }
    }
  }
};