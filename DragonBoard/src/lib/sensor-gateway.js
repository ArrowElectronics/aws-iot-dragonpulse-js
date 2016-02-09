'use strict';

/**
 * Expose 'SensorGateway'
 */
module.exports = SensorGateway;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');
var sensorJob = require('./lib/ti-sensortag/sensor-job');
var gatewayJob = require('./lib/gateway-job');

/**
 * Constants
 */
var tiOptions={
    readGyroscope:true,
    readMagneto:true,
    readAccel:false,
    readTemp:true,
    readHumidity:true,
    readBarometer:false,
    readLuxometer:true
}


/**
 * Constructor
 * Initialize a new SensorGateway
 */
function SensorGateway(name){
	this.sensorJobs=[];
    this.name=name;
}

/**
 * Class Methods
 */

SensorGateway.prototype.addSensor=function(sensorTag){
    if(sensorTag){
        console.log('adding: ' + sensorTag.id + ' | type: ' + sensorTag.type);
        var sJob = new sensorJob(this.name, sensorTag, tiOptions);
        sJob.init();
        this.sensorJobs.push(sJob);   
    }
}

//---------------------------------------
 
SensorGateway.prototype.removeSensor=function(sensorTag){
    if(sensorTag){ 
        if(this.sensorJobs.length > 0){
            for(var i=0; i < this.sensorJobs.length; i++){
               
            }
        }
    }
}

//---------------------------------------

SensorGateway.prototype.getNumSensors=function(){
    return this.sensorJobs.length;
}

//---------------------------------------

SensorGateway.prototype.readData=function(){
    
    console.log('scheduling read data...');
    var gj = new gatewayJob(this.sensorJobs);
    
    schedule.scheduleJob(gj.rule, function(){
       gj.execute();
    });
}

//---------------------------------------