'use strict';

module.exports = {
  region: '__aws_region__',
  accountNumber: '__aws_accountNumber__',
  admin: {
    registry: '__aws_registryDir__'
  },
  iam: {
    lambda: {
      roleName: 'DragonPulse-Lambda'
    },
    api: {
      roleName: 'DragonPulse-ApiGateway'
    },
    iot: {
      roleName: 'DragonPulse-IoT'
    }
  },
  lambda: {
    monitor: {
      name: 'DragonPulse-monitor',
      handler: 'monitor.handler'
    },
    things: {
      name: 'DragonPulse-things',
      handler: 'things.handler'
    }
  },
  dynamodb: {
    disk: {
      name: 'DragonPulse-monitorDisk'
    },
    general: {
      name: 'DragonPulse-monitorGeneral'
    },
    network: {
      name: 'DragonPulse-monitorNetwork'
    },
    process: {
      name: 'DragonPulse-monitorProcess'
    }
  },
  iot: {
    policies: {
      DragonPulseThing: 'DragonPulse'
    },
    topics: {
      disk: 'DragonPulseMonitorDisk',
      general: 'DragonPulseMonitorGeneral',
      network: 'DragonPulseMonitorNetwork',
      process: 'DragonPulseMonitorProcess'
    }
  }
};
