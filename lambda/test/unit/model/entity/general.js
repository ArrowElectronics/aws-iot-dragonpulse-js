var Bluebird = require('bluebird');

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var Validator = require('jsonschema').Validator;

var config = require('./../../config');

var general = require('model/entity/general');

var generalSchema = {
  "id": "/generalSchema",
  "allOf": [
    {
      deviceType: {
        "$ref": "/entity/monitor/general#/definitions/deviceType"
      }
    },
    {
      os: {
        "$ref": "/entity/monitor/general#/definitions/os"
      }
    },
    {
      osVariant: {
        "$ref": "/entity/monitor/general#/definitions/osVariant"
      }
    },
    {
      osVersion: {
        "$ref": "/entity/monitor/general#/definitions/osVersion"
      }
    },
    {
      osCodename: {
        "$ref": "/entity/monitor/general#/definitions/osCodename"
      }
    },
    {
      build: {
        "$ref": "/entity/monitor/general#/definitions/build"
      }
    },
    {
      architecture: {
        "$ref": "/entity/monitor/general#/definitions/architecture"
      }
    }
  ],
  required: [ "deviceType", "os", "osVariant", "osVersion", "osCodename", "build", "architecture" ]
};

describe('the general entity model', function() {
  var context = config.getContext();
  var validator;

  beforeEach(function() {
    validator = new Validator();
    validator.addSchema(general);
  });

  it('must validate valid properties', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var general = {
      deviceType: "MacBookPro11,3",
      os: "darwin",
      osVariant: "Mac OS X",
      osVersion: "10.10.5",
      osCodename: "yosemite",
      build: "14.5.0",
      architecture: "x86_64"
    };

    Bluebird.try(function() {
          var result = validator.validate(general, generalSchema);

          context.logger.info({ validationResult: result }, testName);

          return result.valid;
        })
      .should.eventually.be.fulfilled
      .and.equal(true)
      .and.notify(done);
  });

  it('must not validate invalid property', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var singleSchema = {
      "id": "/singleSchema",
      "deviceType": {
        "$ref": "/entity/monitor/general#/definitions/deviceType"
      },
      "required": [ "deviceType" ],
      "additionalProperties": false
    };

    var general = {
      deviceType: 'foo'
    };

    Bluebird.try(function() {
          var result = validator.validate(general, singleSchema);

          context.logger.info({ validationResult: result }, testName);

          return result.valid;
        })
      .should.eventually.be.fulfilled
      .and.equal(false)
      .and.notify(done);
  });
});
