# aws-iot-thing-sdk-dragonpulse-js

# Introduction
The DragonPulse project demonstrates collecting system data from a DragonBoard
and publishing this data to an MQTT topic.  The data is stored in a DynamoDB
table and retrieved by a web browser through the API Gateway.

# Getting Started
On the DragonBoard, install the node.js server and download the contents
of the DragonBoard directory.

The following steps provide an overview of configuring the Amazon Services

* Configure the Lambda functions through the console
* Create the dragonpulse-monitor-disk, dragonpulse-monitor-general, dragonpulse-monitor-network, and dragonpulse-monitor-process DynamoDB tables
* Configure the API Gateway for the Lambda functions through the Amazon console.  The API Gateway will need to enable CORS for retrieving data for disk, general, network, and process resources.

Upload the contents of the ui directory to s3 and configure the bucket to
act as a static website following the instructions at
http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html.


