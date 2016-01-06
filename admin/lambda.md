---
layout: topic
---
# Overview

The DragonPulse example utilizes the following Lambda functions
written in JavaScript

* DragonPulse-things
* DragonPulse-monitor

# Lambda Function Management

The following tasks have been defined to create, update, and delete
the DragonPulse Lambda functions.

## Create

The Lambda functions rely upon the general DragonPulse configuration and
<a href="http://gruntjs.com", target="_blank">Grunt</a>,
a JavaScript Task Runner.  The NODE_PATH environment variable should be
set to include the lib directory.  This allows multiple modules to work
provided that the script is run from the module root.  The following steps
will deploy the Lambda functions

```sh
$ cd lambda
$ export NODE_PATH=lib
$ npm install ../config
$ npm install -g grunt-cli
$ npm install
$ grunt create
```

When these steps have been completed, the Lambda functions will be
available for use.  You can check their availability either through the
AWS console or by using the following command (remember to use a backtick(`)
around the DragonPulse string)

```sh
$ aws lambda list-functions \
--query 'Functions[?FunctionName.contains(@, `DragonPulse`)]'
```

The create task will also add the appropriate resource-basedpermissions.
The permissions needed by a Lambda function are mentioned in the
[Detail](#detail) section.

## Update

If you decide to experiment and alter the functionality of a Lambda function,
a grunt task has been defined to perform an update.  The following command
will perform an update of all the Lambda functions

```sh
$ grunt update
```

## Delete

In order to delete the Lambda functions, use the following command

```sh
$ grunt delete
```

## Targets

The above commands will perform the task for all Lambda functions.  If you
would like to perform the task for a particular Lambda function use the
following command

```sh
$ grunt ${task}:${target}
```

where task may be create, update, or delete and target would have a value of

Target | Lambda Function
-------|----------------
things | DragonPulse-things
monitor  | DragonPulse-monitor

# Detail

The management of the Lambda functions require each function to be packaged
and the AWS _Lambda_ service to be configured.  In addition, the functionality
of each Lambda function is discussed.

## Package

Each Lambda function is packaged using
<a href="http://browserify.org" target="_blank">Browserify</a> and
<a href="https://github.com/mishoo/UglifyJS2" target="_blank">Uglify</a>.
This reduces the size of the Lambda function and improves startup performance.

Amazon includes the JavaScript aws-sdk within the Lambda environment and
therefore it is excluded when performing the packaging of the function.

## Configuration

The DragonPulse Lambda functions use the same configuration of utilizing
1024 MB of memory and a timeout of 5 seconds.  In addition, each Lambda
function is configured to use the DragonPulse-Lambda IAM role.

## Function Descriptions

Each Lambda function represents the operations that may be performed on a
resource (API Gateway).

* DragonPulse-things

    The DragonPulse-things function will retrieve information about
    all things or about a specific thing.  The function only returns
    a thing if it has an associated principal (certificate).  Thus,
    you may notice a difference between the output of the command

    ```sh
    $ aws iot list-things
    ```

    and the things returned by this function.

    Essentially, this Lambda function provides the capabilities of the API
    to perform

    * GET /things
    * GET /things/{thingId}

    As you will see in the step, [Manage Things](./things.html),
    a utility will create a thing, a certificate (principal), and will
    associate the thing to the principal as well as the DragonPulse IoT
    policy.

* DragonPulse-monitor

    The DragonPulse-monitor function will create an observation for each
    information type.  The Lambda function will store the information
    according to the parameters passed.  Consider a message to create a
    disk observation

    ```json
    {
      "action": "create",
      "type": "disk",
      "message": {
      }
    }
    ```

    The type parameter dictates the DynamoDB table that will be used
    to store the information in the included message.

    The _IoT_ service does not currently support a role-based
    permission model.  Instead a resource-based permission must be configured
    that allows the DragonPulse-monitor Lambda function to be invoked.
    The create task configures a permission that allows the
    DragonConnect-monitor lambda function to be invoked when a message
    is received on the disk, general, network, and process MQTT topic.

    For more information, see **Create a Rule to Invoke a Lambda Function**
    of <a href="http://docs.aws.amazon.com/iot/latest/developerguide/config-and-test-rules.html"
    target="_blank">Configure and Test Rules</a> in the IoT Developer Guide.

    This function also enables the following API operations

    * GET /things/{thingId}/monitor/disk
    * GET /things/{thingId}/monitor/general
    * GET /things/{thingId}/monitor/network
    * GET /things/{thingId}/monitor/process
