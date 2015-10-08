'use strict';

/**
 * Expose 'GeneralTask'
 */
module.exports = GeneralTask;


/**
 * Module dependencies
 */
var generalObject = require('./general-object');
var readLine = require('readline');
var childProcess = require('child_process');
var iUtil = require('../util');
var util = new iUtil();

/**
 * Constructor
 * Initialize a new DiskTask
 */
function GeneralTask(){
	this.goInstance = null;
}

/**
 * Class Methods
 */
GeneralTask.prototype.getGeneralInformation = function(){
	//run the command, parse the command, return a result
	console.log('running general information task');

	//make sure this is a new instance everytime
	this.goInstance = new generalObject();
	
	//do uname first to find out if its a mac or linux box
	// $ uname -smr
	var returnObject = childProcess.spawnSync('uname', ['-smr']);
	
	var os='unknown';
	
	//determine the os type
	if(returnObject.stdout){
		var displayStr = returnObject.stdout.toString().trim().toLowerCase();
		if(displayStr){
			var splitDisplay = displayStr.split(" ");
			if(splitDisplay.length === 3){
				os = splitDisplay[0];
				var version = splitDisplay[1];
				var arch = splitDisplay[2];
				
				var device = detectDevice(os,version,arch);
				if(device){
					this.goInstance.deviceType=device;
				}
				
				this.goInstance.architecture=arch;
				this.goInstance.build=version;
				
			}
			else{
				console.log('invalid length, unknown')
			}
		}
		else{
			console.log('no results');
		}
	}
	
	this.goInstance.os=os;
	
	if(this.goInstance.os === 'darwin'){
		var mp=getMachineIdAndProductMac();
		if(mp){
			this.goInstance.thingId=mp.machineId;
			this.goInstance.deviceType=mp.product;
		}
		var res = getOsDetailMac();
		if(res){
			this.goInstance.osVariant = res.osVariant;
			this.goInstance.osVersion = res.osVersion;
			this.goInstance.osCodename = res.osCodename;
		}
	}
	else if(this.goInstance.os === 'linux'){
		this.goInstance.thingId=getMachineIdLinux();
		var res = getOsDetailLinux();
		if(res){
			this.goInstance.osVariant = res.osVariant;
			this.goInstance.osVersion = res.osVersion;
			this.goInstance.osCodename = res.osCodename;
		}
	}
	else{
		console.log('unsupported os system');
	}
	
	return this.goInstance;
}

/**
 * Helper Methods
 */

function detectDevice(os, version, arch){
	if(os){		
		if(os==='linux'){
			if(version.indexOf('linaro')>=0){
				if(arch==='aarch64'){
					return 'DragonBoard';
				}
			}
		}
	}
	return '';
}

// $ ioreg -c IOPlatformExpertDevice -d 2 | awk -F\" '/IOPlatformSerialNumber/{print $(NF-1)}'
// $ ioreg -rd1 -c IOPlatformExpertDevice | grep IOPlatformSerialNumber
function getMachineIdAndProductMac(){
	var result={};
	var returnObject = childProcess.spawnSync('ioreg', ['-rd1', '-c','IOPlatformExpertDevice']);
	//couldnt figure out how to do a pipe, we'll just do things the hard way for now
	if(returnObject.stdout){
		//lets split by newline
		var snSplit = returnObject.stdout.toString().trim().split('\n');
		if(snSplit){
			for(var i=0; i<snSplit.length; i++){
				var temp = snSplit[i].trim();
				if(temp.indexOf('IOPlatformSerialNumber') >= 0){
					result.machineId=util.getValueFromKeyValueStr(temp, '=');
				}
				if(temp.indexOf('product-name') >= 0){
					result.product=util.getValueFromKeyValueStr(temp, '=').replace(/</g,'').replace(/>/g,'');
				}
			}
		}
	}
	return result;
}

// $ sw_vers
function getOsDetailMac(){
	var result={};
	var returnObject = childProcess.spawnSync('sw_vers');
	if(returnObject.stdout){
		var snSplit = returnObject.stdout.toString().trim().split('\n');
		if(snSplit){
			for(var i=0; i<snSplit.length; i++){
				var temp = snSplit[i].trim();
				if(temp.indexOf('ProductName') >= 0){
					result.osVariant=util.getValueFromKeyValueStr(temp,':');
				}
				if(temp.indexOf('ProductVersion') >= 0){
					result.osVersion=util.getValueFromKeyValueStr(temp,':');
					result.osCodename=getCodenameMac(result.osVersion);
				}
			}
		}
	}
	
	return result;
}

// $ cat /var/lib/dbus/machine-id 
function getMachineIdLinux(){
	var returnObject = childProcess.spawnSync('cat', ['/var/lib/dbus/machine-id']);
	if(returnObject.stdout){
		return returnObject.stdout.toString().trim();
	}
	
	return '';
}

// $ cat /etc/lsb-release
function getOsDetailLinux(){
	var result={};
	var returnObject = childProcess.spawnSync('cat', ['/etc/lsb-release']);
	if(returnObject.stdout){
		var snSplit = returnObject.stdout.toString().trim().split('\n');
		if(snSplit){
			for(var i=0; i<snSplit.length; i++){
				var temp = snSplit[i].trim();
				if(temp.indexOf('DISTRIB_ID') >= 0){
					result.osVariant=util.getValueFromKeyValueStr(temp,'=');
				}
				if(temp.indexOf('DISTRIB_RELEASE') >= 0){
					result.osVersion=util.getValueFromKeyValueStr(temp,'=');
				}
				if(temp.indexOf('DISTRIB_CODENAME') >= 0){
					result.osCodeName=util.getValueFromKeyValueStr(temp,'=');
				}
			}
		}
	}
	
	return result;
}

//just for fun we'll include the mac codename
function getCodenameMac(version){
	if(version){
		var versionSplit = version.split('.');
		if(versionSplit.length >= 2){
			//we only need the second number.
			//we assume it will start on 10 - 10.x
			var minor = Number(versionSplit[1]);		
			var codename = 'unknown';
			switch(minor){
				case 0:
					codename='cheetah';
					break;
				case 1:
					codename='puma';
					break;
				case 2:
					codename='jaguar';
					break;
				case 3:
					codename='panther';
					break;
				case 4:
					codename='tiger';
					break;
				case 5:
					codename='leopard';
					break;
				case 6:
					codename='snow leopard';
					break;
				case 7:
					codename='lion';
					break;
				case 8:
					codename='mountain lion';
					break;
				case 9:
					codename='mavericks';
					break;
				case 10:
					codename='yosemite';
					break;
				case 11:
					codename='el capitan';
					break;
			}
			
			return codename;
		}
	}
	
	return '';
}


