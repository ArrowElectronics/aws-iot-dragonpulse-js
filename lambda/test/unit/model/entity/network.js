var Bluebird = require('bluebird');

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var Validator = require('jsonschema').Validator;

var config = require('./../../config');

var network = require('model/entity/network');

var networkSchema = {
  "id": "/filesystemsSchema",
  "allOf": [
    {
      "totalSendRate": {
        "$ref": "/entity/monitor/network#/definitions/totalSendRate"
      },
      "nInterface": {
        "$ref": "/entity/monitor/network#/definitions/totalSendRate"
      },
      "cummulative": {
        "$ref": "/entity/monitor/network#/definitions/cummulative"
      },
      "totalSendRecvRate": {
        "$ref": "/entity/monitor/network#/definitions/totalSendRecvRate"
      },
      "macAddress": {
        "$ref": "/entity/monitor/network#/definitions/macAddress"
      },
      "peakRate": {
        "$ref": "/entity/monitor/network#/definitions/peakRate"
      },
      "totalRecvRate": {
        "$ref": "/entity/monitor/network#/definitions/totalRecvRate"
      },
      "ipAddress": {
        "$ref": "/entity/monitor/network#/definitions/ipAddress"
      }
    }
  ],
  "required": [ "totalSendRate", "nInterface", "cummulative", "totalSendRecvRate", "macAddress", "peakRate",
    "totalRecvRate", "ipAddress" ]
};

describe('the network entity model', function() {
  var context = config.getContext();
  var validator;

  beforeEach(function() {
    validator = new Validator();
    validator.addSchema(network);
  });

  it('must validate valid properties', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var network = {
      totalSendRate: 10,
      nInterface: 'nInterface',
      cummulative: [ 1, 2, 3 ],
      totalSendRecvRate: 20,
      macAddress: '06:5e:60:d7:f8:97',
      peakRate: [ 1, 2, 3 ],
      totalRecvRate: 30,
      ipAddress: '192.168.1.139'
    };

    Bluebird.try(function() {
          var result = validator.validate(network, networkSchema);

          context.logger.info({ validationResult: result }, testName);

          return result.valid;
        })
      .should.eventually.be.fulfilled
      .and.equal(true)
      .and.notify(done);
  });
});
