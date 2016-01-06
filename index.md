---
layout: introduction
---
# Introduction

The DragonPulse project is a JavaScript application that runs on the
DragonBoard&trade; and collects general system, disk, network, and process
information.  The collected information is published to an MQTT topic of
Amazon IoT where a Lambda function stores it in a DynamoDB table.  An
HTML dashboard hosted using Amazon _s3_ accesses endpoints
through the Amazon _API Gateway_ and displays the collected information.

<br/>

* * *
_**NOTE**_

Due to an issue with the Amazon _IoT_ service, some of the collected data is
not property translated through the SQL statement specified in the topic rules.
Until this issue is resolved, some data on the dashboard will not be shown.
When the issue is addressed, the data will be available on the dashboard.
* * *

<br/>

Table of Contents
* * *
* Example Overview
    * [Collect System Information](./functionality/systemInformation.html)
* Administration
    * [General Configuration](./admin/general_conf.html)
    * [IAM Roles and IoT Policies and Topic Rules](./admin/foundation.html)
    * [Create the Lambda Functions](./admin/lambda.html)
    * [DragonPulse API](./admin/api.html)
    * [DragonPulse Dashboard](./admin/dashboard.html)
    * [Manage Things](./admin/things.html)
* Execution
    * [Execute the Client](./execution/client.html)
    * [Visit the DragonPulse Dashboard](./execution/dashboard.html)
