'use strict';

var Bluebird = require('bluebird'),
    deepcopy = require('deepcopy');

var config = require('dragonpulse-config');

var errors = require('./../../error'),
    AccessDeniedError = errors.AccessDeniedError,
    UnknownError = errors.UnknownError;

var ValidationManager = require('./../../model/validationmanager').ValidationManager;

var single = require('./../things/single');

// Browserify performs static analysis and the following will create a require of the needed request schemas
var bulk = require('bulk-require');
bulk(__dirname, [ './../../model/monitor/*/create/request.js' ]);

function createItemParams(monitorType, message, context) {
  var methodName = 'monitor-create#transformRequest()';

  var returnValue = {
    TableName:  config['dynamodb'][monitorType]['name'],
    Item: {
      thingId: message.thingId,
      observation: JSON.stringify(message)
    }
  };
  context.logger.info( { message: message, params: returnValue }, methodName);

  return returnValue;
}

function handleError(err, context) {
  var methodName = 'monitor-create#handleError()';

  context.logger.info( { error: err }, methodName);

  var condition;
  if (err && err.hasOwnProperty('statusCode')) {
    switch (err.statusCode) {
      case 403:
        condition = new AccessDeniedError(err.message);
        break;
      default:
        var statusCode = -1 || err.statusCode;
        condition = new UnknownError(statusCode, err.message);
        break;
    }
  } else {
    condition = err;
  }

  throw condition;
}

var storeItem = function(monitorType, message, context, iot, dynamoDb) {
  var methodName = 'monitor-create#storeItem()';

  var putItem = Bluebird.promisify(dynamoDb.putItem, { context: dynamoDb });

  var requestSchema = require('../../model/monitor/' + monitorType + '/create/request.js');
  return new ValidationManager(context).validate(message, requestSchema)
    .then(function() {
        // Ensure that the thing exists and is associated with a principal

        var params = {
          thingId: message.thingId
        };

        return single(params, context, iot);
      })
    .then(function() {
        return createItemParams(monitorType, message, context);
      })
    .then(putItem)
    .then(function(result) {
        context.logger.info({ result: result, expected: {} }, methodName);
      })
    .catch(function(err) {
        handleError(err, context);
      });
};

module.exports = storeItem;