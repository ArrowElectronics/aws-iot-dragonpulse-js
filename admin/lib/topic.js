var AWS = require('aws-sdk'),
    Promise = require('bluebird');

var configure = require('./helper').configure;

function createResources(rules, context) {
  configure(AWS, context);

  var iot = new AWS.Iot();
  var awsCreateTopicRule = Promise.promisify(iot.createTopicRule, { context: iot });

  return Promise.each(rules,
    function(rule, index, length) {
      console.info('Creating topic rule with name of ' + rule.ruleName);

      awsCreateTopicRule(rule);
    });
}

function deleteResources(rules, context) {
  configure(AWS, context);

  var iot = new AWS.Iot();
  var awsDeleteTopicRule = Promise.promisify(iot.deleteTopicRule, { context: iot });

  return Promise.each(rules,
    function(rule, index, length) {
      console.info('Deleting topic rule with name of ' + rule.ruleName);

      awsDeleteTopicRule({
        ruleName: rule.ruleName
      });
    });
}

var manage = function(cmd, context) {
  var roleArn = ['arn:aws:iam:', context.aws.accountNumber, 'role/dragonpulse'].join(':');

  var rules = [
    {
      ruleName: 'dragonPulseMonitorGeneral',
      topicRulePayload: {
        sql: "SELECT topic(2) as thingId, * FROM 'things/+/monitor/general'",
        ruleDisabled: false,
        actions: [
          {
            dynamoDB: {
              hashKeyField: 'thingId',
              roleArn: roleArn,
              tableName: 'dragonPulse-monitor-general',
              hashKeyValue: '${topic(2)}',
              rangeKeyValue: '${timestamp}',
              rangeKeyField: 'timestamp'
            }
          }
        ]
      }
    },
    {
      ruleName: 'dragonPulseMonitorDisk',
      topicRulePayload: {
        sql: "SELECT topic(2) as thingId, * FROM 'things/+/monitor/disk'",
        ruleDisabled: false,
        actions: [
          {
            dynamoDB: {
              hashKeyField: 'thingId',
              roleArn: roleArn,
              tableName: 'dragonPulse-monitor-disk',
              hashKeyValue: '${topic(2)}',
              rangeKeyValue: '${timestamp}',
              rangeKeyField: 'timestamp'
            }
          }
        ]
      }
    },
    {
      ruleName: 'dragonPulseMonitorNetwork',
      topicRulePayload: {
        sql: "SELECT topic(2) as thingId, * FROM 'things/+/monitor/network'",
        ruleDisabled: false,
        actions: [
          {
            dynamoDB: {
              hashKeyField: 'thingId',
              roleArn: roleArn,
              tableName: 'dragonPulse-monitor-network',
              hashKeyValue: '${topic(2)}',
              rangeKeyValue: '${timestamp}',
              rangeKeyField: 'timestamp'
            }
          }
        ]
      }
    },
    {
      ruleName: 'dragonPulseMonitorProcess',
      topicRulePayload: {
        sql: "SELECT topic(2) as thingId, * FROM 'things/+/monitor/process'",
        ruleDisabled: false,
        actions: [
          {
            dynamoDB: {
              hashKeyField: 'thingId',
              roleArn: roleArn,
              tableName: 'dragonPulse-monitor-process',
              hashKeyValue: '${topic(2)}',
              rangeKeyValue: '${timestamp}',
              rangeKeyField: 'timestamp'
            }
          }
        ]
      }
    }
  ];

  switch(cmd) {
    case 'create':
      return createResources(rules, context);
      break;
    case 'delete':
      return deleteResources(rules, context);
      break;
    default:
      throw new TypeError('Unknown command of ' + cmd);
  }
};

module.exports = manage;