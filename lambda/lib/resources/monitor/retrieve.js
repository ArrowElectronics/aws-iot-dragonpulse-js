'use strict';

var Bluebird = require('bluebird'),
    deepcopy = require('deepcopy');

var config = require('dragonpulse-config');

var errors = require('./../../error'),
    AccessDeniedError = errors.AccessDeniedError,
    ResourceNotFoundError = errors.ResourceNotFoundError,
    UnknownError = errors.UnknownError;

var ValidationManager = require('./../../model/validationmanager').ValidationManager;

var single = require('./../things/single');

// Browserify performs static analysis and the following will create a require of the needed request schemas
var bulk = require('bulk-require');
bulk(__dirname, [ './../../model/monitor/*/retrieve/request.js' ]);

function createRetrievalParams(monitorType, message, context) {
  var methodName = 'monitor-retrieve#transformRequest()';

  var returnValue = {
    TableName:  config['dynamodb'][monitorType]['name'],
    ScanIndexForward: false,
    KeyConditionExpression: 'thingId = :thingId',
    ExpressionAttributeValues: {
      ':thingId': message.thingId
    }
  };
  context.logger.info( { message: message, params: returnValue }, methodName);

  return returnValue;
}

function transformResponse(thingId, result, context) {
  var methodName = 'monitor-retrieve#transformResponse()';

  var items = result.Items;
  if (items.length == 0) {
    throw new ResourceNotFoundError();
  }

  var returnValue = JSON.parse(items[0].observation);

  context.logger.info({ thingId: thingId, result: result, response: returnValue }, methodName);

  return returnValue;
}

function handleError(err, context) {
  var methodName = 'monitor-retrieve#handleError()';

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

var retrieve = function(monitorType, message, context, iot, dynamoDb) {
  var query = Bluebird.promisify(dynamoDb.query, { context: dynamoDb });

  var thingId = message.thingId;

  var requestSchema = require('../../model/monitor/' + monitorType + '/retrieve/request.js');
  return new ValidationManager(context).validate(message, requestSchema)
    .then(function() {
        // Ensure that the thing exists and is associated with a principal

        var params = {
          thingId: thingId
        };

        return single(params, context, iot);
      })
    .then(function() {
        return createRetrievalParams(monitorType, message, context);
      })
    .then(query)
    .then(function(result) {
        return transformResponse(thingId, result, context);
      })
    .catch(function(err) {
        handleError(err, context);
      });
};

module.exports = retrieve;