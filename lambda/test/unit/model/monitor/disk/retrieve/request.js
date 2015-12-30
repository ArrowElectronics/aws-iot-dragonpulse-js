var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var ValidationManager = require('model/validationmanager').ValidationManager;

var subjectSchema = require('model/monitor/disk/retrieve/request');

var config = require('./../../../../config');

describe('the monitor-disk retrieve request model', function() {
  var context = config.getContext();
  var validationManager;

  beforeEach(
    function () {
      validationManager = new ValidationManager(context);
    }
  );

  it('must not validate an event with additional properties', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var event = {
      thingId: 'invalidAudioEventRetrieveRequest',
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
