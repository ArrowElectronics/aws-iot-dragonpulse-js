'use strict';

var config = require('dragonpulse-config');

function createLambdaArn(resource) {
  return [ 'arn:aws:lambda', config.region, config.accountNumber, 'function', resource ].join(':');
}

module.exports = {
  disk: {
    sql: "SELECT 'create' as action, 'disk' as type, " +
                "* as message, topic(2) as message.thingId " +
         "FROM 'things/+/monitor/disk'",
    ruleDisabled: false,
    actions: [
      {
        lambda: {
          functionArn: createLambdaArn(config.lambda.monitor.name)
        }
      }
    ]
  },
  general: {
    sql: "SELECT 'create' as action, 'general' as type, " +
                "* as message, topic(2) as message.thingId " +
         "FROM 'things/+/monitor/general'",
    ruleDisabled: false,
    actions: [
      {
        lambda: {
          functionArn: createLambdaArn(config.lambda.monitor.name)
        }
      }
    ]
  },
  network: {
    sql: "SELECT 'create' as action, 'network' as type, " +
                "* as message, topic(2) as message.thingId " +
         "FROM 'things/+/monitor/network'",
    ruleDisabled: false,
    actions: [
      {
        lambda: {
          functionArn: createLambdaArn(config.lambda.monitor.name)
        }
      }
    ]
  },
  process: {
    sql: "SELECT 'create' as action, 'process' as type, " +
                "* as message, topic(2) as message.thingId " +
         "FROM 'things/+/monitor/process'",
    ruleDisabled: false,
    actions: [
      {
        lambda: {
          functionArn: createLambdaArn(config.lambda.monitor.name)
        }
      }
    ]
  }
};
