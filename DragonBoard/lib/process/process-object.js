'use strict';

/**
 * Expose 'ProcessObject'
 */
module.exports = ProcessObject;

/**
 * Module dependencies
 */
var processLineObject = require('./process-line-object');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constants
 */
 var DEFAULT_DELIMITER = " ";
 var COLON_DELIMITER = ":";
 var COMMA_DELIMITER = ",";
 var USE_TEN_SECOND_RATE = 2;
 var NUMBER_OF_PROCESSES = 5;


/**
 * Constructor
 * Initialize a new ProcessObject
 */
function ProcessObject(thingId){
	this.thingId=thingId;
	this.timestamp= new Date().getTime();
	this.counter=0;
	this.loadAvg=[];
	this.cpuUsage=[];
	this.tasks=[];
	this.memory=[];
	this.processList=[];
}

/**
 * Class Methods
 */
ProcessObject.prototype.read = function(line, osType){

	if(line){
		if(osType){
			if(osType==='darwin'){
				this.readMac(line);
			}
			else if(osType==='linux'){
				this.readLinux(line);
			}
		}
	}

	//increment the counter
	this.counter+=1;
}

//read specifically for mac
ProcessObject.prototype.readMac = function(line){

	//reduce the white space
	line = line.reduceWhiteSpace();

	if(this.counter===1 || this.counter===4 || this.counter===5 || (this.counter>=7 && this.counter<=11)){
		//skip
	}
	else if(this.counter===0){
		//tasks
		var taskSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(taskSplit){
			//total, running, sleeping, zombie
			this.tasks.push(taskSplit[1].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[2].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[4].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[3].trim().split(DEFAULT_DELIMITER)[0]);
		}
	}
	else if(this.counter===2){
		//load Avg
		var loadSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(loadSplit){
			this.loadAvg.push(loadSplit[1].trim());
			this.loadAvg.push(loadSplit[2].trim());
			this.loadAvg.push(loadSplit[3].trim());
		}
	}
	else if(this.counter===3){
		//cpu usage
		var cpuSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(cpuSplit){
			this.cpuUsage.push(util.extractNumberStr(cpuSplit[1].trim().split(DEFAULT_DELIMITER)[0]));
			this.cpuUsage.push(util.extractNumberStr(cpuSplit[2].trim().split(DEFAULT_DELIMITER)[0]));
			this.cpuUsage.push(util.extractNumberStr(cpuSplit[3].trim().split(DEFAULT_DELIMITER)[0]));
		}
	}
	else if(this.counter===6){
		var memSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(memSplit){
			//total, used, free, buffers
			var strUsedMem = memSplit[1].trim().split(DEFAULT_DELIMITER)[0];
			var strFreeMem = memSplit[2].trim().split(DEFAULT_DELIMITER)[0];
			var totalMem = 0;
			
			//need to transform to Kb
			var usedMem = util.convertStrMemory(strUsedMem, 'K');
			var freeMem = util.convertStrMemory(strFreeMem, 'K');
			
			totalMem = usedMem + freeMem;
			this.memory.push(''+totalMem);
			this.memory.push(''+usedMem);
			this.memory.push(''+freeMem);
			//no buffers
			this.memory.push(''+0);
		}
	}
	else{
		//split the line by space
		var splitLine = line.trim().split(DEFAULT_DELIMITER);

		if(splitLine.length ===7){

			var plObj = new processLineObject();

			plObj.pid=splitLine[0];
			plObj.command=splitLine[1];
			plObj.cpu=splitLine[2];
			plObj.ttime=splitLine[3];
			plObj.memory= ''+util.convertStrMemory(splitLine[4],'K');
			plObj.state=splitLine[5];
			plObj.user=splitLine[6];
			
			if(this.processList.length < NUMBER_OF_PROCESSES){
				this.processList.push(plObj);
			}
		}
	} //else counter
}

//read specifically for linux
ProcessObject.prototype.readLinux = function(line){
	//reduce the white space
	line = line.reduceWhiteSpace();

	if((this.counter>=4 && this.counter<=6)){
		//skip
	}
	else if(this.counter===0){
		//load Avg
		var loadSplit = util.splitKeyValue(line, 'load average:', COMMA_DELIMITER);
		if(loadSplit){
			this.loadAvg.push(loadSplit[1].trim());
			this.loadAvg.push(loadSplit[2].trim());
			this.loadAvg.push(loadSplit[3].trim());
		}
	}
	else if(this.counter===1){
		//task types
		var taskSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(taskSplit){
			//total, running, sleeping, zombie
			this.tasks.push(taskSplit[1].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[2].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[3].trim().split(DEFAULT_DELIMITER)[0]);
			this.tasks.push(taskSplit[5].trim().split(DEFAULT_DELIMITER)[0]);
		}
	}
	else if(this.counter===2){
		//cpu usage
		var cpuSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(cpuSplit){
			//user, system, idle
			this.cpuUsage.push(cpuSplit[1].trim().split(DEFAULT_DELIMITER)[0]);
			this.cpuUsage.push(cpuSplit[2].trim().split(DEFAULT_DELIMITER)[0]);
			this.cpuUsage.push(cpuSplit[4].trim().split(DEFAULT_DELIMITER)[0]);
		}
	}
	else if(this.counter===3){
		//memory in Kb
		var memSplit = util.splitKeyValue(line, COLON_DELIMITER, COMMA_DELIMITER);
		if(memSplit){
			//total, used, free, buffers
			this.memory.push(Number(memSplit[1].trim().split(DEFAULT_DELIMITER)[0]));
			this.memory.push(Number(memSplit[2].trim().split(DEFAULT_DELIMITER)[0]));
			this.memory.push(Number(memSplit[3].trim().split(DEFAULT_DELIMITER)[0]));
			this.memory.push(Number(memSplit[4].trim().split(DEFAULT_DELIMITER)[0]));
		}
	}
	else{
		//split the line by space
		var splitLine = line.trim().split(DEFAULT_DELIMITER);

		if(splitLine.length ===12){

			var plObj = new processLineObject();

			plObj.pid=splitLine[0];
			plObj.command=splitLine[11];
			plObj.cpu=splitLine[8];
			plObj.ttime=splitLine[10];
			plObj.memory=splitLine[4];
			//removed - pretty useless
			//plObj.nice=splitLine[3];
			//plObj.priority=splitLine[2];
			
			var stateAbbr = splitLine[7];
			
			if(stateAbbr === 'S'){
				plObj.state='sleeping';
			}
			else if(stateAbbr === 'R'){
				plObj.state='running';
			}
			else if(stateAbbr === 'D'){
				plObj.state='uniterruptible sleep';
			}
			else if(stateAbbr === 'T'){
				plObj.state='traced';
			}
			else if(stateAbbr === 'Z'){
				plObj.state='zombie';
			}
			
			plObj.user=splitLine[1];
			
			if(this.processList.length < NUMBER_OF_PROCESSES){
				this.processList.push(plObj);
			}
		}
	} //else counter
}

