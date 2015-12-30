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

var subject = require('resources/monitor/create');

var config = require('./../../../config');

describe('creating a network observation', function() {
  var MONITOR_TYPE = 'network';

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
    var putItemStub = sinon.stub(dynamoDb, 'putItem');
    putItemStub.throws(new Error('Not implemented!'));

    var message = {
      thingId: thingId,
      timestamp: Math.floor(new Date().getTime() / 1000),
      counter: 1,
      totalSendRate: 10,
      nInterface: 'eth0',
      cummulative: [ 1, 2, 3 ],
      totalSendRecvRate: 20,
      macAddress: '06:5e:60:d7:f8:97',
      peakRate: [ 1, 2, 3 ],
      totalRecvRate: 30,
      ipAddress: '192.168.1.139'
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

  it('must create a disk observation', function(done) {
    var testName = this.test.fullTitle();

    context.logger.info(testName);

    var thingId = 'test';

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

    var dynamoDb = new dynamoDoc.DynamoDB();
    var putItemStub = sinon.stub(dynamoDb, 'putItem');
    putItemStub.yields(null, {});

    var message = {
      thingId: thingId,
      timestamp: Math.floor(new Date().getTime() / 1000),
      counter: 1,
      totalSendRate: 10,
      nInterface: 'eth0',
      cummulative: [ 1, 2, 3 ],
      totalSendRecvRate: 20,
      macAddress: '06:5e:60:d7:f8:97',
      peakRate: [ 1, 2, 3 ],
      totalRecvRate: 30,
      ipAddress: '192.168.1.139'
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
      .should.eventually.be.fulfilled
      .and.notify(done);
  });
});