'use strict';

/**
 * Expose 'ProcessTask'
 */
module.exports = ProcessTask;

/**
 * Module dependencies
 */
var processObject = require('./process-object');
var readLine = require('readline');
var childProcess = require('child_process');

/**
 * Constants
 */

var PROCESS_TOPIC = 'monitor/process';


/**
 * Constructor
 * Initialize a new NetworkTask
 */
function ProcessTask(info){
	this.poInstance = null;
	this.generalInfo = info;
}

/**
 * Class Methods
 */
ProcessTask.prototype.runAndParse = function(callback){
	var osType ='';
	
	if(this.generalInfo){
		osType=this.generalInfo.os;
		
		//run the command, parse the command, return a result
		console.log('running process command for ' + osType);
	
		//make sure this is a new instance everytime
		this.poInstance = new processObject(this.generalInfo.thingId);
		
		var commandLine='';
		
		//create the child process to execute $ top
	
		if(this.generalInfo.os==='darwin'){
			commandLine = childProcess.spawn('top', ['-o','mem','-n','10','-l','1','-s','2','-stats','pid,command,cpu,time,mem,state,user']);
		}
		else if(this.generalInfo.os==='linux'){
			commandLine = childProcess.spawn('top', ['-bn1']);
		}
		
		var poPass = this.poInstance;
		
		var lineReader = readLine.createInterface(commandLine.stdout, commandLine.stdin);
	
		lineReader.on('line', function(line){
			poPass.read(line, osType);
		});
	
		commandLine.on('close', function(code, signal){
			//console.log('read ' + poPass.counter + ' lines');
			callback(PROCESS_TOPIC, poPass);
		});
	}
	else{
		//skipping execution
		console.log('skipping process task due to no general information');
	}
}