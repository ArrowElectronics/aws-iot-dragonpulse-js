'use strict';

/**
 * Expose 'GeneralJob'
 */
module.exports = GeneralJob;

/**
 * Module dependencies
 */
var schedule = require('node-schedule');
var generalTask = require('./general-task');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constants
 */

var GENERAL_TOPIC = 'monitor/general';


/**
 * Constructor
 * Initialize a new GeneralJob
 */
function GeneralJob(){
	this.rule= new schedule.RecurrenceRule();
	this.rule.second = new schedule.Range(0,59,5);

	this.task= new generalTask();
}

/**
 * Class Methods
 */

GeneralJob.prototype.init = function(){
	var gInfo = this.task.getGeneralInformation();
	//send to amazon
	util.sendToAmazon(GENERAL_TOPIC, gInfo);
	
	return gInfo;
}