'use strict';

/**
 * Expose 'NetworkTask'
 */
module.exports = NetworkTask;

/**
 * Module dependencies
 */
var networkObject = require('./network-object');
var readLine = require('readline');
var childProcess = require('child_process');


/**
 * Constants
 */

var NETWORK_TOPIC = 'monitor/network';

/**
 * Constructor
 * Initialize a new NetworkTask
 */
function NetworkTask(info){
	this.noInstance = null;
	this.generalInfo = info;
}

/**
 * Class Methods
 */
NetworkTask.prototype.runAndParse = function(callback){
	if(this.generalInfo){
		//run the command, parse the command, return a result
		console.log('running network command');
	
		//make sure this is a new instance everytime
		this.noInstance = new networkObject(this.generalInfo.thingId);
		
		
		//lets run ifconfig to get mac address and ip
		if(this.generalInfo.os === 'darwin'){
			var res = getNetworkInterfacesMac();
			if(res){
				this.noInstance.nInterface=res.iname;
				this.noInstance.ipAddress=res.ip;
				this.noInstance.macAddress=res.mac;
			}
		}
		else if(this.generalInfo.os === 'linux'){
			var res = getNetworkInterfacesLinux();
			if(res){
				this.noInstance.nInterface=res.iname;
				this.noInstance.ipAddress=res.ip;
				this.noInstance.macAddress=res.mac;
			}
		}
		else{
			console.log('not implemented');
		}
		
		//create the child process to execute $ iftop -t -s 2 -P -N
		//must run as ROOT on ubuntu side
		//add the interface - from the active network
		var commandLine = childProcess.spawn('iftop', ['-t','-s','3','-P','-N','-b','-B','-i',this.noInstance.nInterface]);
	
		var noPass = this.noInstance;
		var lineReader = readLine.createInterface(commandLine.stdout, commandLine.stdin);
	
		lineReader.on('line', function(line){
			noPass.read(line);
		});
	
		commandLine.on('close', function(code, signal){
			//console.log('read ' + noPass.counter + ' lines');
			callback(NETWORK_TOPIC, noPass);
		});
	}
	else{
		//skipping execution
		console.log('skipping network task due to missing general information');
	}
}

/**
 * Helper Methods
 */

// get all available network interfaces for mac
// return an object with {iname, ip, mac, status}
function getNetworkInterfacesMac(){
	var result={};
	var availableInterfaces=[];
	
	var returnObject = childProcess.spawnSync('ifconfig', ['-a']);
	if(returnObject.stdout){
		var displayStr = returnObject.stdout.toString().trim().toLowerCase();
		
		if(displayStr){
			var ifSplit = displayStr.split('\n');
			if(ifSplit){
				
				//declare a point array
				var currInterface={};
				
				for(var i=0; i<ifSplit.length; i++){
					var temp = ifSplit[i].reduceWhiteSpace().trim();
	
					//search for the first line of each 
					if(temp.indexOf('flags=')>=0){
						if(currInterface.iname){
							//lets save this interface
							availableInterfaces.push(currInterface);
						}
	
						//this is the first line
						var interfaceSplit = temp.split(':');
						if(interfaceSplit.length == 2){
							//lets get the name
							var iName = interfaceSplit[0];
							//create a new interface and point current to this one
							var tempInterface = {};
							tempInterface.iname=iName;
							currInterface = tempInterface;
						}
					}
					else{
						//this is a regular line
						//search for ether - which contains the mac address
						//search for inet which should contain the ip address
						//search for status, which indicates status
						
						//space is important here to diffrentiate between inet6
						if(temp.indexOf('inet ') >=0){
							var ipSplit = temp.split(' ');
							if(ipSplit.length >= 4){
								currInterface.ip=ipSplit[1].trim();
							}
						}
						if(temp.indexOf('ether')>=0){
							var macSplit = temp.split(' ');
							if(macSplit.length >= 2){
								currInterface.mac=macSplit[1].trim();
							}
						}
						
						//we'll use a different algo on mac osx since
						//it actually returns the current 
						if(temp.indexOf('status')>=0){
							var statusSplit = temp.split(':');
							if(statusSplit.length >= 2){
								currInterface.status=statusSplit[1].trim();
							}
						}
					}
				}
				
				//lets save the last interface
				if(currInterface.iname){
					availableInterfaces.push(currInterface);
				}
			}
		}
	}
	
	if(availableInterfaces.length > 0){
		for(var j=0; j<availableInterfaces.length; j++){
			var tRes = availableInterfaces[j];

			if(tRes){
				//we still have a possibility of seeing 2 interfaces available
				if(tRes.status==='active' && tRes.ip && tRes.mac){
					result=tRes;
					return result;
				}
			}
		}
	}
	
	return result;
}

function getNetworkInterfacesLinux(){
	var result={};
	var availableInterfaces=[];
	
	var returnObject = childProcess.spawnSync('ifconfig', ['-a']);
	if(returnObject.stdout){
		var displayStr = returnObject.stdout.toString().trim().toLowerCase();
		
		if(displayStr){
			var ifSplit = displayStr.split('\n');
			if(ifSplit){
				
				//declare a point array
				var currInterface={};
				
				for(var i=0; i<ifSplit.length; i++){
					var temp = ifSplit[i].reduceWhiteSpace().trim();
					
					//search for the first line of each 
					if(temp.indexOf('link encap')>=0){
						if(currInterface.iname){
							//lets save this interface
							availableInterfaces.push(currInterface);
						}
	
						//this is the first line
						var interfaceSplit = temp.split('link encap:');
						if(interfaceSplit.length == 2){
							//lets get the name
							var iName = interfaceSplit[0].trim();
							
							var macAddr='';
							//lets get the macaddr
							var macSplit = interfaceSplit[1].trim().split(' ');
							
							if(macSplit.length==3){
								macAddr = macSplit[2];
							}
							
							//create a new interface and point current to this one
							var tempInterface = {};
							tempInterface.iname=iName;
							if(macAddr){
								tempInterface.mac=macAddr;
							}
							currInterface = tempInterface;
						}
					}
					else{
						//this is a regular line
						//search for ether - which contains the mac address
						//search for inet which should contain the ip address
						//search for status, which indicates status
						
						//space is important here to diffrentiate between inet6
						if(temp.indexOf('inet addr:') >=0){
							var ipBlockSplit = temp.split(' ');
							
							if(ipBlockSplit.length >= 2){
								//take the second entry
								var ipSplit=ipBlockSplit[1].split(':');
								if(ipSplit.length >= 2){
									currInterface.ip=ipSplit[1].trim();
									
									//if both ip and mac exist
									if(currInterface.mac){
										currInterface.status='active';
									}
								}
							}
						}
					}
				}
				
				//lets save the last interface
				if(currInterface.iname){
					availableInterfaces.push(currInterface);
				}
			}
		}
	}
	
	//currently only returns the first active link - if there are multiple
	//interfaces active, we will probably need to handle multiple 
	if(availableInterfaces.length > 0){
		for(var j=0; j<availableInterfaces.length; j++){
			var tRes = availableInterfaces[j];
			
			if(tRes){
				if(tRes.status==='active'){
					result=tRes;
				}
			}
		}
	}
	
	return result;
}