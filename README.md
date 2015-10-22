# aws-iot-thing-sdk-dragonpulse-js

# Introduction
The DragonPulse project demonstrates collecting system data from a DragonBoard
and publishing this data to an MQTT topic.  The data is stored in a DynamoDB
table and retrieved by a web browser through the API Gateway.

# Getting Started
On the DragonBoard, install the node.js server and download the contents
of the DragonBoard directory.

# Amazon Setup
The following steps provide an overview of configuring the Amazon Services

* Configure the Lambda functions through the console
* Create the dragonpulse-monitor-disk, dragonpulse-monitor-general, dragonpulse-monitor-network, and dragonpulse-monitor-process DynamoDB tables
* Configure the API Gateway for the Lambda functions through the Amazon console.  The API Gateway will need to enable CORS for retrieving data for disk, general, network, and process resources.

Upload the contents of the ui directory to s3 and configure the bucket to
act as a static website following the instructions at
http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html.

# DragonBoard Install

## Certificate Setup
1. In the AWS IoT console, select "Create a resource"
2. Choose "Create a certificate", this will present 2 options (Create with CSR or 1-Click Certificate Create)
3. Choose "1-Click Certificate Create"
4. Download the public, private keys and the certificate - these will reside on the device
5. On the DragonBoard, create a folder called certs in /home/linaro/certs and copy the private key and certificate into the folder. Be sure to remove the hash before the name. The node application will look for these files in order to subscribe/publish messages.
  * certificate.pem.crt
  * private.pem.key
6. Click on "Certificates", Choose the previously created certificate and under "Actions", Select "Activate"
7. Attach the IoT Policy to the certificate, "PubSubToAnyTopic"
 
## DragonBoard Setup
1. Copy the contents of the DragonBoard folder to /home/linaro/dragonpulse
2. Install the libraries
```sh
npm install
```
3. Run as root, in order to access iftop
```sh
sudo su
npm start
```


