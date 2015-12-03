var createArn = function(resource, context) {
  var aws = context.aws;

  return ['arn:aws:iot', aws.region, aws.accountNumber, resource].join(':');
};

var configure = function(AWS, context) {
  AWS.config.update({
    region: context.aws.region
  });
};

module.exports = {
  configure: configure,
  createArn: createArn
};