'use strict';

var APPLICATION_JSON = 'application/json';

var STAGE = 'dev';

var http = require('https');

var dynamoDoc = require('dynamodb-doc');
require('aws-sdk').config.update(
    {
        region: 'us-east-1'
    }
);

var validate = require('jsonschema').validate;

var transfer = function(event, monitorResource, callback) {
    var thingId = event.thingId;
    post('/things/'+ thingId + '/monitor/' + monitorResource, event,
        function(err, response) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, response);
            }
        }
    );
};

var post = function(resource, content, callback) {
    console.info('Event:\n' + JSON.stringify(content, null, 2));

    var requestOptions = {
        host: '',
        path: '/' + STAGE + resource,
        method: 'POST',
        headers: {
            'Content-Type': APPLICATION_JSON,
            'Accept': APPLICATION_JSON
        }
    };

    var request = http.request(requestOptions,
        function(response) {
            var message = 'Status Code:  ' + response.statusCode + ', Status Message:  ' + response.statusMessage;
            console.info(message);

            if (response.statusCode != 201) {
                callback(new Error('UnknownResultException:  ' + message, null));
            } else {
                callback(null, response);
            }
        }
    );

    request.on('error',
        function(err) {
            console.error('UnknownError:  ' + err);

            callback(err, null);
        }
    );

    request.write(JSON.stringify(content));
    request.end();
};

var retrieve = function(event, table, limit, callback) {
    console.info('Event:\n' + JSON.stringify(event, null, 2));

    var thingId = event.thingId;
    var params = {
        TableName: table,
        ScanIndexForward: false,
        KeyConditionExpression: 'thingId = :thingId',
        ExpressionAttributeValues: {
            ":thingId": thingId
        },
        Limit: limit
    };

    var docClient = new dynamoDoc.DynamoDB();
    docClient.query(params,
        function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data['Items']);
            }
        }
    );
};

var create = function(event, requestSchema, tableName, callback) {
    console.info('Event:\n' + JSON.stringify(event, null, 2));

    var thingId = event.thingId;
    var observation = event.message;

    var validationResult = validate(observation, requestSchema);
    if (false === validationResult.valid) {
        console.info('Invalid Request:  ' + JSON.stringify(validationResult, null, 2));

        callback(new Error(
            'InvalidRequestException :  Consult the developer documentation for the proper message contents.'), null);
    }

    var params = {
        TableName: tableName,
        Item: {
            thingId: thingId,
            timestamp: observation['timestamp'],
            observation: observation
        }
    };

    var docClient = new dynamoDoc.DynamoDB();
    docClient.putItem(params,
        function(err, data) {
            if (err) {
                console.error(err);

                callback(err, null);
            } else {
                console.info('Observation created for thing ' + thingId);

                callback(null, data);
            }
        }
    );
};

module.exports = {
    create: create,
    retrieve: retrieve,
    transfer: transfer,
};
