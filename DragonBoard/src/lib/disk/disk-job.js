'use strict';

/**
 * Expose 'DiskJob'
 */
module.exports = DiskJob;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');
var diskTask = require('./disk-task');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constructor
 * Initialize a new DiskJob
 */
function DiskJob(info,config){
	this.rule= new schedule.RecurrenceRule();
	this.rule.second = new schedule.Range(0,59,config.diskRefresh);

	this.task= new diskTask(info);
}

/**
 * Class Methods
 */
DiskJob.prototype.execute = function(){
	//execute the job and send to aws
	this.task.runAndParse(util.sendToAmazon);
}

/**
 * Helper Functions
 */
//function to send to amazon
