var Bluebird = require('bluebird');

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var Validator = require('jsonschema').Validator;

var config = require('./../../config');

var disk = require('model/entity/disk');

var filesystemsSchema = {
  "id": "/filesystemsSchema",
  "allOf": [
    {
      "$ref": "/entity/monitor/disk#/definitions/filesystems"
    }
  ]
};

describe('the disk entity model', function() {
  var context = config.getContext();
  var validator;

  beforeEach(function() {
    validator = new Validator();
    validator.addSchema(disk);
  });

  it('must validate a valid filesystems property', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var filesystems = [
      {
        "filesystem": "udev",
        "fSize": 0,
        "used": 0,
        "available": 0,
        "usage": "0%",
        "mounted": "/dev"
      },
      {
        "filesystem": "tmpfs",
        "fSize": 0,
        "used": 0,
        "available": 0,
        "usage": "10%",
        "mounted": "/run"
      }
    ];

    Bluebird.try(function() {
          var result = validator.validate(filesystems, filesystemsSchema);

          context.logger.info({ validationResult: result }, testName);

          return result.valid;
        })
      .should.eventually.be.fulfilled
      .and.equal(true)
      .and.notify(done);
  });

  it('must not validate a filesystem with an additional property', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var filesystems = [
      {
        "filesystem": "tmpfs",
        "fSize": 0,
        "used": 0,
        "available": 0,
        "usage": "10%",
        "mounted": "/run",
        "additionalProperty": true
      }
    ];

    Bluebird.try(function() {
        var result = validator.validate(filesystems, filesystemsSchema);

        context.logger.info({ validationResult: result }, testName);

        return result.valid;
      })
      .should.eventually.be.fulfilled
      .and.equal(false)
      .and.notify(done);
  })
});
