var AWS = require('aws-sdk'),
    Promise = require('bluebird');

var configure = require('./helper').configure;

var tables = [
  {
    name: 'dragonPulse-monitor-general',
    hashKey: 'thingId',
    rangeKey: 'timestamp'
  },
  {
    name: 'dragonPulse-monitor-disk',
    hashKey: 'thingId',
    rangeKey: 'timestamp'
  },
  {
    name: 'dragonPulse-monitor-network',
    hashKey: 'thingId',
    rangeKey: 'timestamp'
  },
  {
    name: 'dragonPulse-monitor-process',
    hashKey: 'thingId',
    rangeKey: 'timestamp'
  }
];

function createTable(method, table) {
  console.info('Creating table ' + table.name);

  var params = {
    TableName: table.name,
    KeySchema: [
      {
        AttributeName: table.hashKey,
        KeyType: 'HASH'
      },
      {
        AttributeName: table.rangeKey,
        KeyType: 'RANGE'
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: table.hashKey,
        AttributeType: 'S'
      },
      {
        AttributeName: table.rangeKey,
        AttributeType: 'S'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  return method(params);
}

function createResources(context) {
  configure(AWS, context);

  var dynamoDb = new AWS.DynamoDB();
  var awsCreateTable = Promise.promisify(dynamoDb.createTable, { context: dynamoDb });

  return Promise.each(tables,
    function(table, index, length) {
      createTable(awsCreateTable, table);
    });
}

function deleteTable(method, table) {
  console.info('Deleting table ' + table.name);

  var params = {
    TableName: table.name
  };

  return method(params);
}

function deleteResources(context) {
  configure(AWS, context);

  var dynamoDb = new AWS.DynamoDB();
  var awsDeleteTable = Promise.promisify(dynamoDb.deleteTable, { context: dynamoDb });

  return Promise.each(tables,
    function(table, index, length) {
      deleteTable(awsDeleteTable, table);
    });
}

var manage = function(cmd, context) {
  switch(cmd) {
    case 'create':
      return createResources(context);
      break;
    case 'delete':
      return deleteResources(context);
      break;
    default:
      throw new TypeError('Unknown command of ' + cmd);
  }
};

module.exports = manage;