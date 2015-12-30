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

describe('creating a process observation', function() {
  var MONITOR_TYPE = 'process';

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
      loadAvg: [
        '1.14',
        '1.12',
        '1.14'
      ],
      cpuUsage: [
        '2.4',
        '1.1',
        '96.4'
      ],
      tasks: [
        '183',
        '2',
        '181',
        '0'
      ],
      memory: [
        '922892',
        '800944',
        '121948',
        '38584'
      ],
      processList: [
        {
          pid: '605',
          command: 'Xorg',
          cpu: '86.9',
          ttime: '3:15.27',
          memory: '170400',
          state: 'running',
          user: 'root'
        },
        {
          pid: '3795',
          command: 'iftop',
          cpu: '30.7',
          ttime: '0:00.07',
          memory: '163228',
          state: 'sleeping',
          user: 'root'
        },
        {
          pid: '3798',
          command: 'top',
          cpu: '15.3',
          ttime: '0:00.08',
          memory: '5172',
          state: 'running',
          user: 'root'
        }
      ]
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

  it('must create a process observation', function(done) {
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
      loadAvg: [
        '1.14',
        '1.12',
        '1.14'
      ],
      cpuUsage: [
        '2.4',
        '1.1',
        '96.4'
      ],
      tasks: [
        '183',
        '2',
        '181',
        '0'
      ],
      memory: [
        '922892',
        '800944',
        '121948',
        '38584'
      ],
      processList: [
        {
          pid: '605',
          command: 'Xorg',
          cpu: '86.9',
          ttime: '3:15.27',
          memory: '170400',
          state: 'running',
          user: 'root'
        },
        {
          pid: '3795',
          command: 'iftop',
          cpu: '30.7',
          ttime: '0:00.07',
          memory: '163228',
          state: 'sleeping',
          user: 'root'
        },
        {
          pid: '3798',
          command: 'top',
          cpu: '15.3',
          ttime: '0:00.08',
          memory: '5172',
          state: 'running',
          user: 'root'
        }
      ]
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