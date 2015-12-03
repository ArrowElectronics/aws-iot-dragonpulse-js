var program = require('commander'),
    Promise = require('bluebird');

var db = require('./db'),
    iam = require('./iam'),
    iot = require('./iot'),
    topic = require('./topic');

function manage(action, context) {
  Promise.try(function() {
        return db(action, context)
      })
    .then(function() {
        return iot(action, context)
      })
    .then(function() {
        return iam(action, context);
      })
    .then(function() {
        return topic(action, context);
      });
}

program
  .version('0.1.0');

program
  .command('create <accountNumber> <region> <thingId>')
  .description('Create the example resources')
  .action(function(accountNumber, region, thingId, options) {
    var context = {
      thingId: thingId,
      aws: {
        accountNumber: accountNumber,
        region: region
      }
    };

    manage('create', context);
  });

program
  .command('delete <region> <thingId>')
  .description('Delete the example resources')
  .action(function(region, thingId, options) {
    var context = {
      thingId: thingId,
      aws: {
        region: region
      }
    };

    manage('delete', context);
  });

program.parse(process.argv);

