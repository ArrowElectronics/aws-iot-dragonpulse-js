---
layout: topic
---

# Overview

The DragonPulse client is an application written in JavaScript that
collects and transmits system information collected from the
DragonBoard&trade;.  The client application uses the MQTT function of the
_IoT_ service.

# Configuration

The configuration of the client copies the certificates of the thing.

## Certificates

Copy the certificate information generated when the thing was created earlier
to the certs directory

```sh
$ cd DragonBoard/certs
$ export THING_ID=$(cat /etc/machine-id)
$ cp ../../admin/registry/${THING_ID}/aws.{key,crt} .
```

# Running the Client

The client may now be executed by issuing the following commands

```sh
$ cd DragonBoard
$ npm start
```

# Stopping the Client

The client is stopped using sending a KILL signal to the process which includes
typing a Ctrl-C in the terminal running the process.
