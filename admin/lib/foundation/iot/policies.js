'use strict';

var config = require('dragonpulse-config');

var POLICY_VERSION = "2012-10-17";
var ALLOW = "Allow";

function createIotArn(resource) {
  return ['arn:aws:iot', config.region, config.accountNumber, resource].join(':');
}

module.exports = {
  DragonPulseThing: {
    "Version": POLICY_VERSION,
    "Statement": [
      {
        "Effect": ALLOW,
        "Action": [
          "iot:Connect"
        ],
        "Resource": [
          "*"
        ]
      },
      {
        "Effect": ALLOW,
        "Action": [
          "iot:Publish"
        ],
        "Resource": [
          createIotArn('topic/things/*/monitor/disk')
        ]
      },
      {
        "Effect": ALLOW,
        "Action": [
          "iot:Publish"
        ],
        "Resource": [
          createIotArn('topic/things/*/monitor/general')
        ]
      },
      {
        "Effect": ALLOW,
        "Action": [
          "iot:Publish"
        ],
        "Resource": [
          createIotArn('topic/things/*/monitor/network')
        ]
      },
      {
        "Effect": ALLOW,
        "Action": [
          "iot:Publish"
        ],
        "Resource": [
          createIotArn('topic/things/*/monitor/process')
        ]
      }
    ]
  }
};