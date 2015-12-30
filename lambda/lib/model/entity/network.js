module.exports = {
  "id": "/entity/monitor/network",
  "definitions": {
    "totalSendRate": {
      "type": "number"
    },
    "nInterface": {
      "type": "string"
    },
    "cummulative": {
      "type": "array",
      "minItems": 3,
      "maxItems": 3,
      "items": {
        "type": "number"
      }
    },
    "totalSendRecvRate": {
      "type": "number"
    },
    "macAddress": {
      "type": "string",
      "pattern": "([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}"
    },
    "peakRate": {
      "type": "array",
      "minItems": 3,
      "maxItems": 3,
      "items": {
        "type": "number"
      }
    },
    "totalRecvRate": {
      "type": "number"
    },
    "ipAddress": {
      "type": "string",
      "pattern": "([0-9]{1,3}\.){3}[0-9]{1,3}"
    }
  }
};