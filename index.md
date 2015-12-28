---
layout: default
---
# Introduction

The DragonPulse project collects general system, disk, network, and process
information.  The collected information is published to an MQTT topic of
Amazon IoT where a Lambda function stores it in a DynamoDB table.  A
dashboard whose static web pages are stored in s3 accesses endpoints
hosted on the API Gateway display the collected information.
