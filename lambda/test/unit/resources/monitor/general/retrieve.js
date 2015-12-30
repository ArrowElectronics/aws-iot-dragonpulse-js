var AWS = require('aws-sdk'),
    dynamoDoc = require('dynamodb-doc'),
    deepcopy = require('deepcopy'),
    randomString = require('randomr'),
    uuid = require('uuid'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.should();

var subject = require('resources/monitor/retrieve');

var config = require('./../../../config');

describe('retrieving a general observation', function() {
  var MONITOR_TYPE = 'general';

  var context = config.getContext();

  it('must throw an exception for a non-existent thing', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var thingId = uuid.v4();

    var listThingsResponse = {
      "things": [
        {
          "attributes": {},
          "thingName": thingId
        }
      ]
    };
    var iot = new AWS.Iot();
    var listThingsStub = sinon.stub(iot, 'listThings');
    listThingsStub.yields(null, listThingsResponse);

    var listThingPrincipalsResponse = {
      "principals": [
      ]
    };
    var listThingPrincipalsStub = sinon.stub(iot, 'listThingPrincipals');
    listThingPrincipalsStub.yields(null, listThingPrincipalsResponse);

    var dynamoDb = new AWS.DynamoDB();
    var putItemStub = sinon.stub(dynamoDb, 'query');
    putItemStub.throws(new Error('Not implemented!'));

    var message = {
      thingId: thingId
    };

    subject(MONITOR_TYPE, message, context, iot, dynamoDb)
      .catch(function(err) {
          context.logger.error({ error: err }, testName);

          throw err;
        })
      .finally(function() {
          listThingsStub.restore();
          listThingPrincipalsStub.restore();
          putItemStub.restore();
        })
      .should.eventually.be.rejectedWith(/^ResourceNotFoundError/)
      .and.notify(done);
  });

  it('must throw an exception if a general entry does not exist', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var thingId = uuid.v4();

    var listThingsResponse = {
      "things": [
        {
          "attributes": {},
          "thingName": thingId
        }
      ]
    };

    AWS.config.update({ region: 'us-east-1' });

    var iot = new AWS.Iot();
    var listThingsStub = sinon.stub(iot, 'listThings');
    listThingsStub.yields(null, listThingsResponse);

    var listThingPrincipalsResponse = {
      "principals": [
        String(randomString(64, 'hex'))
      ]
    };
    var listThingPrincipalsStub = sinon.stub(iot, 'listThingPrincipals');
    listThingPrincipalsStub.yields(null, listThingPrincipalsResponse);

    var noItemsQueryResponse = {
      Items: [],
      Count: 0,
      ScannedCount: 0
    };
    var dynamoDb = new dynamoDoc.DynamoDB();
    var queryStub = sinon.stub(dynamoDb, 'query');
    queryStub.yields(null, noItemsQueryResponse);

    var message = {
      thingId: thingId
    };

    subject(MONITOR_TYPE, message, context, iot, dynamoDb)
      .catch(function(err) {
          context.logger.error({ error: err }, testName);

          throw err;
        })
      .finally(function() {
          listThingsStub.restore();
          listThingPrincipalsStub.restore();
          queryStub.restore();
        })
      .should.eventually.be.rejectedWith(/^ResourceNotFoundError/)
      .and.notify(done);
  });

  it('must return existing general observation', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var thingId = uuid.v4();

    var listThingsResponse = {
      "things": [
        {
          "attributes": {},
          "thingName": thingId
        }
      ]
    };

    AWS.config.update({ region: 'us-east-1' });

    var iot = new AWS.Iot();
    var listThingsStub = sinon.stub(iot, 'listThings');
    listThingsStub.yields(null, listThingsResponse);

    var listThingPrincipalsResponse = {
      "principals": [
        String(randomString(64, 'hex'))
      ]
    };
    var listThingPrincipalsStub = sinon.stub(iot, 'listThingPrincipals');
    listThingPrincipalsStub.yields(null, listThingPrincipalsResponse);

    var expected = {
      thingId: thingId,
      timestamp: Math.floor(new Date().getTime() / 1000),
      deviceType: "MacBookPro11,3",
      os: "darwin",
      osVariant: "Mac OS X",
      osVersion: "10.10.5",
      osCodename: "yosemite",
      build: "14.5.0",
      architecture: "x86_64"
    };

    var diskQueryResponse = {
      Items: [
        {
          thingId: thingId,
          observation: JSON.stringify(expected)
        }
      ],
      Count: 1,
      ScannedCount: 1
    };
    var dynamoDb = new dynamoDoc.DynamoDB();
    var queryStub = sinon.stub(dynamoDb, 'query');
    queryStub.yields(null, diskQueryResponse);

    var message = {
      thingId: thingId
    };

    subject(MONITOR_TYPE, message, context, iot, dynamoDb)
      .catch(function(err) {
        context.logger.error({ error: err }, testName);

        throw err;
      })
      .finally(function() {
        listThingsStub.restore();
        listThingPrincipalsStub.restore();
        queryStub.restore();
      })
      .should.eventually.be.fulfilled
      .and.deep.equal(expected)
      .and.notify(done);
  });
});