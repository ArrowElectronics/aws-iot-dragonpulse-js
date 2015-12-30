var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var ValidationManager = require('model/validationmanager').ValidationManager;

var subjectSchema = require('model/monitor/disk/create/request');

var config = require('./../../../../config');

describe('the monitor-disk create request model', function() {
  var context = config.getContext();
  var validationManager;

  beforeEach(
    function () {
      validationManager = new ValidationManager(context);
    }
  );

  it('must validate a valid request', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var message = {
      thingId: 'validMonitorDiskThingId',
      timestamp: Math.floor(new Date().getTime() / 1000),
      counter: 11,
      directoryList: [
        {
          filesystem: "udev",
          fSize: 0,
          used: 0,
          available: 0,
          usage: "0%",
          mounted: "/dev"
        }
      ]
    };

    validationManager.validate(message, subjectSchema)
      .catch(function(ex) {
          context.logger.error({ error: ex }, testName);

          throw ex;
        })
      .should.eventually.be.fulfilled
      .and.notify(done);
  });


  it('must not validate an event with additional properties', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var event = {
      thingId: 'invalidMonitorDiskCreateRequest',
      timestamp: Math.floor(new Date().getTime() / 1000),
      counter: 11,
      directoryList: [
        {
          filesystem: "udev",
          fSize: 0,
          used: 0,
          available: 0,
          usage: "0%",
          mounted: "/dev"
        }
      ],
      additionalProperty: 'val'
    };

    validationManager.validate(event, subjectSchema)
      .catch(function(ex) {
          context.logger.error({ error: ex }, testName);

          throw ex;
        })
      .should.eventually.be.rejectedWith(/^InvalidEntityError/)
      .and.notify(done);
  })
});
