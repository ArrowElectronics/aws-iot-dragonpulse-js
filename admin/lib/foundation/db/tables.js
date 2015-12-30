'use strict';

var config = require('dragonpulse-config');

var defaultThroughput = {
  ReadCapacityUnits: 5,
  WriteCapacityUnits: 5
};

module.exports = [
  {
    name: config.dynamodb.disk.name,
    hashKey: {
      name: 'thingId',
      type: 'S'
    },
    throughput: defaultThroughput
  },
  {
    name: config.dynamodb.general.name,
    hashKey: {
      name: 'thingId',
      type: 'S'
    },
    throughput: defaultThroughput
  },
  {
    name: config.dynamodb.network.name,
    hashKey: {
      name: 'thingId',
      type: 'S'
    },
    throughput: defaultThroughput
  },
  {
    name: config.dynamodb.process.name,
    hashKey: {
      name: 'thingId',
      type: 'S'
    },
    throughput: defaultThroughput
  }
];