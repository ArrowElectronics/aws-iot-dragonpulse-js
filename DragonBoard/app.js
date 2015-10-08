'use strict';

/**
 * Module dependencies.
 */
var diskJob = require('./lib/disk/disk-job');
var networkJob = require('./lib/network/network-job');
var processJob = require('./lib/process/process-job');
var generalJob = require('./lib/general/general-job');
var schedule = require('node-schedule');

/**
 * Main
 */

//go run the general job, wait for it to finish, then run the rest of the jobs

var gjInstance = new generalJob();
var generalInfo = gjInstance.init();

//create the disk job
var djInstance = new diskJob(generalInfo);
var njInstance = new networkJob(generalInfo);
var pjInstance = new processJob(generalInfo);

//enable settings
var ENABLE_DISK = true;
var ENABLE_NETWORK = true;
var ENABLE_PROCESS = true;


if(ENABLE_DISK){
	var dj = schedule.scheduleJob(djInstance.rule, function(){
		console.log('scheduled disk job');
		djInstance.execute();
	});
}

if(ENABLE_NETWORK){
	var nj = schedule.scheduleJob(njInstance.rule, function(){
		console.log('scheduled network job');
		njInstance.execute();
	});
}

if(ENABLE_PROCESS){
	var pj = schedule.scheduleJob(pjInstance.rule, function(){
		console.log('scheduled process job');
		pjInstance.execute();
	});
}

/**
 * Helper Functions
 */
 
//mod to allow removable of extraneous whitespace
String.prototype.reduceWhiteSpace = function() {
    return this.replace(/\s+/g, ' ');
};

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}
