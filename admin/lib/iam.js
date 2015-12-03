var AWS = require('aws-sdk'),
    Promise = require('bluebird');

var configure = require('./helper').configure;

var policyVersion = '2012-10-17';

var roleName = 'dragonpulse';
var policyName = 'dynamodb';

var iotLoggingPolicyArn = 'arn:aws:iam::aws:policy/service-role/AWSIoTLogging';

function createRole(iam) {
  console.info('Creating role ' + roleName);

  var createRole = Promise.promisify(iam.createRole, { context: iam });

  var params = {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: policyVersion,
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: 'iot.amazonaws.com'
          },
          Action: 'sts:AssumeRole'
        }
      ]
    }, null, 2)
  };

  return Promise.resolve()
    .then(function() {
      return createRole(params);
    });
}

function attachDbPolicy(iam) {
  var putRolePolicy = Promise.promisify(iam.putRolePolicy, { context: iam });

  var params = {
    RoleName: roleName,
    PolicyName: policyName,
    PolicyDocument: JSON.stringify({
      Version: policyVersion,
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:PutItem'
          ],
          Resource: [
            '*'
          ]
        }
      ]
    }, null, 2)
  };

  return Promise.resolve()
    .then(function() {
        return putRolePolicy(params);
      });
}

function attachIotLoggingPolicy(iam) {
  var awsAttachRolePolicy = Promise.promisify(iam.attachRolePolicy, { context: iam });

  var params = {
    PolicyArn: iotLoggingPolicyArn,
    RoleName: roleName
  };

  return Promise.resolve()
    .then(function() {
        return awsAttachRolePolicy(params);
      });
}

function createResources(context) {
  configure(AWS, context);

  var iam = new AWS.IAM();

  return Promise.resolve()
    .then(function() {
        return createRole(iam)
      })
    .then(function() {
        return attachDbPolicy(iam);
      })
    .then(function() {
        return attachIotLoggingPolicy(iam);
      });
}

function deleteResources(context) {
  configure(AWS, context);

  console.info('Deleting role ' + roleName);

  var iam = new AWS.IAM();

  var detachRolePolicy = Promise.promisify(iam.detachRolePolicy, { context: iam });
  var deleteRolePolicy = Promise.promisify(iam.deleteRolePolicy, { context: iam });
  var deleteRole = Promise.promisify(iam.deleteRole, { context: iam });

  return Promise.resolve()
    .then(function() {
        return detachRolePolicy({
          RoleName: roleName,
          PolicyArn: iotLoggingPolicyArn
        })
      })
    .then(function() {
        return deleteRolePolicy({
          RoleName: roleName,
          PolicyName: policyName
        })
      })
    .then(function() {
        return deleteRole({
          RoleName: roleName
        });
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