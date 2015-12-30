var Bluebird = require('bluebird');

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var Validator = require('jsonschema').Validator;

var config = require('./../../config');

var process = require('model/entity/process');

var processSchema = {
  "id": "/processSchema",
  "allOf": [
    {
      "loadAvg": {
        "$ref": "/entity/monitor/process#/definitions/loadAvg"
      },
      "cpuUsage": {
        "$ref": "/entity/monitor/process#/definitions/cpuUsage"
      },
      "tasks": {
        "$ref": "/entity/monitor/process#/definitions/tasks"
      },
      "memory": {
        "$ref": "/entity/monitor/process#/definitions/memory"
      },
      "processList": {
        "$ref": "/entity/monitor/network#/definitions/processList"
      }
    }
  ],
  "required": [ "loadAvg", "cpuUsage", "tasks", "memory", "processList" ]
};

describe('the process entity model', function() {
  var context = config.getContext();
  var validator;

  beforeEach(function() {
    validator = new Validator();
    validator.addSchema(process);
  });

  it('must validate valid properties', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var processSample = {
      "loadAvg": [
        "1.14",
        "1.12",
        "1.14"
      ],
      "cpuUsage": [
        "2.4",
        "1.1",
        "96.4"
      ],
      "tasks": [
        "183",
        "2",
        "181",
        "0"
      ],
      "memory": [
        "922892",
        "800944",
        "121948",
        "38584"
      ],
      "processList": [
        {
          "pid": "605",
          "command": "Xorg",
          "cpu": "86.9",
          "ttime": "3:15.27",
          "memory": "170400",
          "state": "running",
          "user": "root",
          "nice": "0",
          "priority": "20"
        },
        {
          "pid": "3795",
          "command": "iftop",
          "cpu": "30.7",
          "ttime": "0:00.07",
          "memory": "163228",
          "state": "sleeping",
          "user": "root",
          "nice": "0",
          "priority": "20"
        },
        {
          "pid": "3798",
          "command": "top",
          "cpu": "15.3",
          "ttime": "0:00.08",
          "memory": "5172",
          "state": "running",
          "user": "root",
          "nice": "0",
          "priority": "20"
        },
        {
          "pid": "3785",
          "command": "node",
          "cpu": "10.2",
          "ttime": "0:00.94",
          "memory": "876892",
          "state": "sleeping",
          "user": "root",
          "nice": "0",
          "priority": "20"
        },
        {
          "pid": "1438",
          "command": "lxterminal",
          "cpu": "5.1",
          "ttime": "0:17.56",
          "memory": "181508",
          "state": "sleeping",
          "user": "linaro",
          "nice": "0",
          "priority": "20"
        }
      ]
    };

    Bluebird.try(function() {
          var result = validator.validate(processSample, processSchema);

          context.logger.info({ validationResult: result }, testName);

          return result.valid;
        })
      .should.eventually.be.fulfilled
      .and.equal(true)
      .and.notify(done);
  });
});
