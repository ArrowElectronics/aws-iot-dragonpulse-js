'use strict';

/**
 * Expose 'DiskTask'
 */
module.exports = DiskTask;

/**
 * Module dependencies
 */
var diskObject = require('./disk-object');
var readLine = require('readline');
var childProcess = require('child_process');

/**
 * Constants
 */

var DISK_TOPIC = 'monitor/disk';

/**
 * Constructor
 * Initialize a new DiskTask
 */
function DiskTask(info){
	this.doInstance = null;
	this.generalInfo = info;
}

/**
 * Class Methods
 */
DiskTask.prototype.runAndParse = function(callback){
	if(this.generalInfo){
		//run the command, parse the command, return a result
		console.log('running disk utilization task');
	
		//make sure this is a new instance everytime
		this.doInstance = new diskObject(this.generalInfo.thingId);
	
		//create the child process to execute $ df -h
		var commandLine = childProcess.spawn('df', ['-h']);
	
		var doPass = this.doInstance;
		var lineReader = readLine.createInterface(commandLine.stdout, commandLine.stdin);
	
		lineReader.on('line', function(line){
			doPass.read(line);
		});
	
		commandLine.on('close', function(code, signal){
			//console.log('read ' + doPass.counter + ' lines');
			callback(DISK_TOPIC, doPass);
		});
	}
	else{
		//skipping execution
		console.log('skipping disk task due to missing general information');
	}
}