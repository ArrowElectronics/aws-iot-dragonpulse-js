# Welcome to aws-iot-thing-sdk-dragonpulse-js

DragonPulse demonstrates collecting system data from a DragonBoard&trade; and publishing this data to an MQTT topic.  The data is stored in a DynamoDB table and retrieved by a web browser through the API Gateway.

# Getting Started
Please see [aws-iot-device-sdk](https://github.com/ArrowElectronics/aws-iot-device-sdk) in order to prepare the DragonBoard&trade; to run DragonPulse.

## Configuring Amazon
The following steps provide an overview of configuring the Amazon Services

* Configure the Lambda functions through the console
* Create the dragonpulse-monitor-disk, dragonpulse-monitor-general, dragonpulse-monitor-network, and dragonpulse-monitor-process DynamoDB tables
* Configure the API Gateway for the Lambda functions through the Amazon console.  The API Gateway will need to enable CORS for retrieving data for disk, general, network, and process resources.

Upload the contents of the ui directory to s3 and configure the bucket to act as a static website following the instructions at [Amazon](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)

## DragonPulse on the DragonBoard&trade;
Make sure to complete the tasks in [aws-iot-device-sdk](https://github.com/ArrowElectronics/aws-iot-device-sdk)


1. DragonPulse step

2. Install the Private key and Certificate

* Run DragonPulse as root, in order to access iftop
```sh
$ sudo su
$ npm start
```

# License
This SDK is distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0), see LICENSE.txt and NOTICE.txt for more information.