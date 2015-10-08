'use strict';

/**
 * Expose 'DiskObject'
 */
module.exports = DiskObject;

/**
 * Module dependencies
 */
var diskLineObject = require('./disk-line-object');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constants
 */
 var DEFAULT_DELIMITER = " ";

/**
 * Constructor
 * Initialize a new DiskObject
 */
function DiskObject(thingId){
	this.thingId=thingId;
	this.timestamp= new Date().getTime();
	this.counter=0;
	this.directoryList=[];
}

/**
 * Class Methods
 */
DiskObject.prototype.read = function(line){
	if(line){

		//reduce the white space
		line = line.reduceWhiteSpace();

		//header line
		if(this.counter===0){
			// skip the header, we assume
			// Filesystem Size Used Avail Use% Mounted_on
		}
		else{
			//split the line by space
			var splitLine = line.split(DEFAULT_DELIMITER);

			if(splitLine){

				//ubuntu version
				//ensure there are 6 segments, which matches our assumption
				if(splitLine.length === 6){
					var dloInstance = new diskLineObject();
					dloInstance.filesystem = splitLine[0];
					dloInstance.fSize=util.convertStrMemory(splitLine[1],'M',false);
					dloInstance.used=util.convertStrMemory(splitLine[2],'M',false);
					dloInstance.available=util.convertStrMemory(splitLine[3],'M',false);
					dloInstance.usage=splitLine[4];
					dloInstance.mounted=splitLine[5];

					this.directoryList.push(dloInstance);
				}
				//this is the mac version
				else if(splitLine.length === 9){
					var dloInstance = new diskLineObject();
					dloInstance.filesystem = splitLine[0];
					dloInstance.fSize=util.convertStrMemory(splitLine[1],'M',false);
					dloInstance.used=util.convertStrMemory(splitLine[2],'M',false);
					dloInstance.available=util.convertStrMemory(splitLine[3],'M',false);
					dloInstance.usage=splitLine[4];
					dloInstance.mounted=splitLine[8];

					this.directoryList.push(dloInstance);
				}
				else{
					if(this.counter <= 0){
						throw new Error('invalid disk line format');
					}
					else{
						//this is just the end of the stream
					}
				}
			}
		}
	}

	//increment the counter
	this.counter+=1;
}
