---
layout: topic
---
# Overview

The DragonPulse example uses several Amazon services including
_API Gateway_, _Lambda_, _IoT_, and _CloudWatch_.  Amazon controls access
to these services using _Identity and Access Management_ (IAM).
The _IAM_ service provides a fine-grain permission model to control
access to all of the Amazon services.  For
more information about _IAM_, please consult the
<a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html"
target="_blank">AWS Identity and Access Management User Guide</a>.
This step will configure _IAM_ to allow the proper access and
the IoT policies and topic rules.

The steps below will get you started and if you are curious about what
the administration utility does beneath the covers then consider reading
the [Details](#details).

# Create IAM and IoT Elements

The DragonPulse example includes several utility functions to help
manage resources.  The following steps will configure the foundational
elements

```sh
$ cd admin
$ npm install ../config
$ npm install
$ node lib/foundation.js create
```

# Remove IAM and IoT Elements

The DragonPulse configuration may be removed by issuing the following commands

```sh
$ cd admin
$ node lib/foundation.js delete
```

# Details
The foundation.js script performs the following functions by Amazon service

* _IAM_
    * Create roles that permit the required actions for the _API Gateway_,
      _Lambda_, and _IoT_ services
* _IoT_
    * Configures the logging options used for debugging purposes
    * Creates policies that allow clients to perform the required operations
      on MQTT topics
    * Creates a topic rule

Additional configuration is required in order to execute DragonPulse and will
be performed by later steps.

### API Gateway IAM Role

The DragonPulse-ApiGateway role includes a trust relationship for
apigateway.amazonaws.com.  This permits the _API Gateway_ to perform the
actions defined by the managed and inline policies.

* Managed Policies

    The **AWSLambdaRole** policy allow's _Lambda_ functions to be invoked.

* Inline Policies

    The **IAMPassRolePolicy** passes the IAM role to the Lambda function.
    For more information, see the section entitled **Granting Permissions
    using the Execution Role** describing the <a href="http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html"
    target="_blank">Lambda Permission Model</a>.

### IoT IAM Role

The DragonPulse-IoT role includes a trust relationship for iot.amazonaws.com.
This permits the _IoT_ service to perform actions defined in the associated
managed policies of

* Managed Policies

    The **AWSIoTLogging** policy allows the management of _CloudWatch_ logs
    and streams.

### Lambda IAM Role

The DragonPulse-Lambda role includes a trust relationship for
lambda.amazonaws.com.  This permits the _Lambda_ service to perform the
actions defined in the associated policies of

* Managed Policies

    The **AWSLambdaBasicExecutionRole** policy allows _CloudWatch_ logs and
    streams to be created.

* Inline Policies

    The **DynamodbPolicy** permits a Lambda function to put an item (create
    a record) and query a table.

    The **IotPolicy** permits a Lambda function to retrieve a list of things.

### IoT Logging

In addition to allowing the role to manage CloudWatch logs and streams as a
part of the DragonPulse-IoT role, _IoT_ logging must be enabled.  This
performs the equivalent of

```sh
$ aws iot set-logging-options --logging-options-payload \
roleArn="arn:aws:iam::012345678901:role/DragonPulse-IoT-59f4",logLevel="DEBUG"
```

### IoT Policy

The DragonPulse IoT policy defines the actions that are allowed on the IoT
MQTT topics

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-1:012345678901:topic/things/*/monitor/disk"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-1:012345678901:topic/things/*/monitor/general"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-1:012345678901:topic/things/*/monitor/network"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-1:012345678901:topic/things/*/monitor/process"
      ]
    }
  ]
}
```

This policy allows connections to be established and vents to be published to
a custom MQTT topic in

* things/+/monitor/disk
* things/+/monitor/general
* things/+/monitor/network
* things/+/monitor/process

### IoT Topic Rules

Several topic rules are required for the DragonPulse example.  Each topic rule
configures a Lambda function to be invoked when a message is received on the
a given MQTT topic

* things/+/monitor/disk

    ```json
    {
        "rule": {
            "sql": "SELECT 'create' as action, 'disk' as type, * as message, topic(2) as message.thingId FROM 'things/+/monitor/disk'",
            "ruleDisabled": false,
            "actions": [
                {
                    "lambda": {
                        "functionArn": "arn:aws:lambda:us-east-1:012345678901:function:DragonPulse-monitor"
                    }
                }
            ],
            "ruleName": "DragonPulseMonitorDisk"
        }
    }
    ```

* things/+/monitor/general

    ```json
    {
        "rule": {
            "sql": "SELECT 'create' as action, 'general' as type, * as message, topic(2) as message.thingId FROM 'things/+/monitor/general'",
            "ruleDisabled": false,
            "actions": [
                {
                    "lambda": {
                        "functionArn": "arn:aws:lambda:us-east-1:012345678901:function:DragonPulse-monitor"
                    }
                }
            ],
            "ruleName": "DragonPulseMonitorGeneral"
        }
    }
    ```

* things/+/monitor/network

    ```json
    {
        "rule": {
            "sql": "SELECT 'create' as action, 'network' as type, * as message, topic(2) as message.thingId FROM 'things/+/monitor/network'",
            "ruleDisabled": false,
            "actions": [
                {
                    "lambda": {
                        "functionArn": "arn:aws:lambda:us-east-1:012345678901:function:DragonPulse-monitor"
                    }
                }
            ],
            "ruleName": "DragonPulseMonitorNetwork"
        }
    }
    ```

* things/+/monitor/process

    ```json
    {
        "rule": {
            "sql": "SELECT * as messsage FROM 'things/+/monitor/process'",
            "ruleDisabled": false,
            "actions": [
                {
                    "lambda": {
                        "functionArn": "arn:aws:lambda:us-east-1:012345678901:function:DragonPulse-monitor"
                    }
                }
            ],
            "ruleName": "DragonPulseMonitorProcess"
        }
    }
    ```

### DynamoDB Tables

DynamoDB tables are used to store the collected information.  This step
creates the table using the _thingId_ (string) as the partition key and does
not use a sort key.

Information Type | Table
-----------------|-------
Disk | DragonPulse-monitorDisk
General | DragonPulse-monitorGeneral
Network | DragonPulse-monitorNetwork
Process | DragonPulse-monitorProcess
