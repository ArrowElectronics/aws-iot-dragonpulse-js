

var config = {
    generalRefresh:5, //sec
    processRefresh:5, //sec
    networkRefresh:5, //sec
    diskRefresh:45, //sec
    awsConfig:{
        certificatePath:'__aws_registryDir__',
        privateKey:'aws.key',
        pemCertificate:'aws.crt',
        rootCertificate:'rootCA.crt',
        region:'__aws_region__'
    }
};

module.exports = config;