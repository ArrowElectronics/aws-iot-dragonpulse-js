'use strict';

var config = require('dragonpulse-config');

function createIotArn(resource) {
  return ['arn:aws:iot', config.region, config.accountNumber, 'rule/' + resource].join(':');
}

module.exports = {
  monitor: [
    {
      FunctionName: config.lambda.monitor.name,
      Action: 'lambda:InvokeFunction',
      Principal: 'iot.amazonaws.com',
      StatementId: 'monitorDiskStatement',
      SourceArn: createIotArn(config.iot.topics.disk)
    },
    {
      FunctionName: config.lambda.monitor.name,
      Action: 'lambda:InvokeFunction',
      Principal: 'iot.amazonaws.com',
      StatementId: 'monitorGeneralStatement',
      SourceArn: createIotArn(config.iot.topics.general)
    },
    {
      FunctionName: config.lambda.monitor.name,
      Action: 'lambda:InvokeFunction',
      Principal: 'iot.amazonaws.com',
      StatementId: 'monitorNetworkStatement',
      SourceArn: createIotArn(config.iot.topics.network)
    },
    {
      FunctionName: config.lambda.monitor.name,
      Action: 'lambda:InvokeFunction',
      Principal: 'iot.amazonaws.com',
      StatementId: 'monitorProcessStatement',
      SourceArn: createIotArn(config.iot.topics.process)
    }
  ]
};