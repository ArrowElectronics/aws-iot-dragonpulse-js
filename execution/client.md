---
layout: topic
---

# Overview

The DragonPulse client is an application written in JavaScript that
collects and transmits system information collected from the
DragonBoard&trade;.  The client application uses the MQTT function of the
_IoT_ service.

# Running the Client

The client may now be executed by issuing the following commands

```sh
$ export PATH=/sbin:/usr/sbin:$PATH
$ cd DragonBoard
$ npm install
$ npm start
```

# Stopping the Client

The client is stopped using sending a KILL signal to the process which includes
typing a Ctrl-C in the terminal running the process.
