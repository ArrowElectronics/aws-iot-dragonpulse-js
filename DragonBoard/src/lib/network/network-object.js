'use strict';

/**
 * Expose 'NetworkObject'
 */
module.exports = NetworkObject;

/**
 * Module dependencies
 */
var networkLineObject = require('./network-line-object');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constants
 */
 var DEFAULT_DELIMITER = " ";
 var COLON_DELIMITER = ":";
 var USE_TEN_SECOND_RATE = 2;
 //must be even , it tracks both in/out
 //basically num routes * 2
 var NUMBER_OF_CONNECTIONS = 4;
 var TRACK_CONNECTIONS = false;

/**
 * Constructor
 * Initialize a new NetworkObject
 */
function NetworkObject(thingId){
	this.thingId=thingId;
	this.timestamp= new Date().getTime();
	this.counter=0;
	this.nInterface='';
	this.ipAddress='';
	this.macAddress='';
	//defaults to INVALID NUMBERS
	this.totalSendRate= -1.0;
	this.totalRecvRate= -1.0;
	this.totalSendRecvRate= -1.0;
	this.peakRate=[];
	this.cummulative=[];
	//dont track connection list
	//this.connectionList=[];
}

/**
 * Class Methods
 */
NetworkObject.prototype.read = function(line){
	if(line){

		//console.log(line);
		
		//reduce the white space
		line = line.reduceWhiteSpace();

		if(this.counter===0){
			//ignore
		}
		else{
			if(line.startsWith('--') || line.startsWith('==')){
				//ignore - these are line breaks;
			}
			else{
				var cleanLine = line.trim();

				if(cleanLine){
					if(cleanLine.startsWith('Total send and')){
						var tsrArr = util.splitKeyValue(cleanLine, COLON_DELIMITER, DEFAULT_DELIMITER);
						this.totalSendRecvRate=util.convertStrMemory(tsrArr[USE_TEN_SECOND_RATE],'K',false);
					}
					else if(cleanLine.startsWith('Total receive')){
						var trArr = util.splitKeyValue(cleanLine, COLON_DELIMITER, DEFAULT_DELIMITER);
						this.totalRecvRate=util.convertStrMemory(trArr[USE_TEN_SECOND_RATE],'K',false);
					}
					else if(cleanLine.startsWith('Total send')){
						var tsArr = util.splitKeyValue(cleanLine, COLON_DELIMITER, DEFAULT_DELIMITER);
						this.totalSendRate=util.convertStrMemory(tsArr[USE_TEN_SECOND_RATE],'K',false);
					}
					else if(cleanLine.startsWith('Peak')){
						var peakArr = util.splitKeyValue(cleanLine, COLON_DELIMITER, DEFAULT_DELIMITER);
						//sent
						this.peakRate.push(util.convertStrMemory(peakArr[1],'K',false));
						//recv
						this.peakRate.push(util.convertStrMemory(peakArr[2],'K',false));
						//total
						this.peakRate.push(util.convertStrMemory(peakArr[3],'K',false));
					}
					else if(cleanLine.startsWith('Cumulative')){
						var cumArr = util.splitKeyValue(cleanLine, COLON_DELIMITER, DEFAULT_DELIMITER);
						//sent
						this.cummulative.push(util.convertStrMemory(cumArr[1],'K',false));
						//recv
						this.cummulative.push(util.convertStrMemory(cumArr[1],'K',false));
						//total
						this.cummulative.push(util.convertStrMemory(cumArr[1],'K',false));
					}
					else{
						if(TRACK_CONNECTIONS){
							//split the line by space
							var splitLine = cleanLine.split(DEFAULT_DELIMITER);
							if(splitLine.length ===7){
								//outgoing
								var nlObj = new networkLineObject('out');
	
								//split the host with port number
								var hostIpPort = splitLine[1].split(COLON_DELIMITER);
								if(hostIpPort && hostIpPort.length === 2){
									nlObj.ip=hostIpPort[0];
									nlObj.nPort=hostIpPort[1];
									nlObj.tier1=util.convertStrMemory(splitLine[3],'K',false);
									nlObj.tier2=util.convertStrMemory(splitLine[4],'K',false);
									nlObj.tier3=util.convertStrMemory(splitLine[5],'K',false);
									nlObj.cummulative=util.convertStrMemory(splitLine[6],'K',false);
									
									if(this.connectionList.length <= NUMBER_OF_CONNECTIONS){
										this.connectionList.push(nlObj);
									}
								}
							}
							//there is no sequence order here
							else if(splitLine.length===6){
								//incoming
								var nlObj = new networkLineObject('in');
	
								var hostIpPort = splitLine[0].split(COLON_DELIMITER);
								if(hostIpPort && hostIpPort.length === 2){
									nlObj.ip=hostIpPort[0];
									nlObj.nPort=hostIpPort[1];
									nlObj.tier1=util.convertStrMemory(splitLine[2],'K',false);
									nlObj.tier2=util.convertStrMemory(splitLine[3],'K',false);
									nlObj.tier3=util.convertStrMemory(splitLine[4],'K',false);
									nlObj.cummulative=util.convertStrMemory(splitLine[5],'K',false);
									
									if(this.connectionList.length <= NUMBER_OF_CONNECTIONS){
										this.connectionList.push(nlObj);
									}
								}
							}
							else{
								//console.log(splitLine.length)
								//console.log(cleanLine);
							}
						} //end track connections
					}
				}
			} //real line
		} //else counter
	}

	//increment the counter
	this.counter+=1;
}


