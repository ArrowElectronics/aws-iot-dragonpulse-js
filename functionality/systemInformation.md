---
layout: topic
---

# Introduction

The DragonPulse example will collect and display general, disk, network,
and process information using the information from the operating system

Observation | Utilities | File
------------|-----------|-----
General | uname | /etc/lsb-release
Disk | df |
Network | ifconfig, iftop |
Process | top |

## Observation Storage

Each observation is stored in a DynamoDB table using the following mechanism

![Observation Storage](./images/ObservationStorage.png)

The following steps occur when an observation is generated

1.  The observation is generated.
2.  The DragonPulse client application transmits the observation to the
    things/+/monitor/* topic using MQTT
3.  The DragonPulse-monitor Lambda function is invoked when a message
    is received on the things/+/monitor/* topic
4.  The DragonPulse-monitor Lambda function stores the event in the
    appropriate DynamoDB table

## Observation Retrieval

The dashboard will retrieve and display the observations.  The
dashboard polls the DragonPulse API periodically and performs the following
steps

![Observation Retrieval](./images/ObservationRetrieval.png)

1.  The web browser makes a request of the /things/{thingId}/monitor/*
    resource
2.  The API Gateway, when a request is received, invokes the
    DragonPulse-monitor Lambda function
3.  The DragonPulse-monitor Lambda function queries the appropriate
    DyanmoDB table for the contents.
4.  The web browser interprets the response and displays the appropriate
    observation
