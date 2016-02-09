'use strict';

/**
 * Expose 'GatewayJob'
 */
module.exports = GatewayJob;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');

/**
 * Constructor
 * Initialize a new GatewayJob
 */

function GatewayJob(jobs){
    this.rule= new schedule.RecurrenceRule();
    //randomize a time between 10-15 so we dont have collisions at same time
	//up to how many sensors? 5
	var rand = Math.floor((Math.random() * 5) + 1);
	var base = 8;
	var period = base+rand;
	
	this.rule.second = new schedule.Range(0,59,2);
    
    console.log('executing every: ' + period);
    
    this.jobs=jobs;
};

/**
 * Class Methods
 */

GatewayJob.prototype.execute=function(){
    if(this.jobs.length > 0){
        for(var i=0; i < this.jobs.length; i++){
            var tSensorJob = this.jobs[i];
            tSensorJob.execute();
        }
    }
    else{
        console.log('no sensors to read from');
    }
}

//---------------------------------------