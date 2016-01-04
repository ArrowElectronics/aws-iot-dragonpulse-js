#  aws-iot-dragonpulse-js

### Arrow DragonPulse

The DragonPulse project collects general system, disk, network, and process
information from a DragonBoard&trade;.  The collected information is
published to an MQTT topic of Amazon IoT where a Lambda function stores
it in a DynamoDB table.  A dashboard whose static web pages are stored
in s3 accesses endpoints hosted on the API Gateway display the collected
information.

# Getting Started

For more information on the DragonPulse project, including how it is
deployed and configured, visit the
<a href="https://arrowelectronics.github.io/aws-iot-dragonpulse-js/" target="_blank">DragonPulse Project</a>

# License
This SDK is distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0), see LICENSE.txt and NOTICE.txt for more information.
