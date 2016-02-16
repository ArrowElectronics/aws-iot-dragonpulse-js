'use strict';

/**
 * Expose 'ProcessJob'
 */
module.exports = ProcessJob;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');
var processTask = require('./process-task');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constructor
 * Initialize a new NetworkJob
 */
function ProcessJob(info,config){
	this.rule= new schedule.RecurrenceRule();
	this.rule.second = new schedule.Range(0,59,config.processRefresh);

	this.task= new processTask(info);
}

/**
 * Class Methods
 */
ProcessJob.prototype.execute = function(){
	//execute the job and send to aws
	this.task.runAndParse(util.sendToAmazon);
}