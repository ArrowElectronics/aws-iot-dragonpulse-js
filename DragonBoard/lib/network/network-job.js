'use strict';

/**
 * Expose 'NetworkJob'
 */
module.exports = NetworkJob;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');
var networkTask = require('./network-task');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constructor
 * Initialize a new NetworkJob
 */
function NetworkJob(info){
	this.rule= new schedule.RecurrenceRule();
	this.rule.second = new schedule.Range(0,59,30);

	this.task= new networkTask(info);
}

/**
 * Class Methods
 */
NetworkJob.prototype.execute = function(){
	//execute the job and send to aws
	this.task.runAndParse(util.sendToAmazon);
}
