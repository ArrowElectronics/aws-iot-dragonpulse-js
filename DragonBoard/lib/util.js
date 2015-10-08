'use strict';

/**
 * Expose 'Util'
 */
module.exports = Util;

/**
 * Module dependencies
 */
var mqtt = require('mqtt');
var fs = require('fs');

/**
 * Constants
 */

var AWS_ENDPOINT='data.iot.us-east-1.amazonaws.com';
var AWS_KEY='./certs/device_key.pem';
var AWS_CERT='./certs/device_identity.pem';
var AWS_G5_CERT='./certs/rootCA.pem';

/**
 * Constructor
 * Initialize a new NetworkTask
 */
function Util(){
}

// convert the str memory to target unit
// G M K B
Util.prototype.convertStrMemory = function(input, units, isCaseSensitive){
	
	var result=0.0;
	
	if(input){
		
		if(!isCaseSensitive){
			input = input.toUpperCase();
		}
		
		var num = extractNumber(input);
		var dist = detectDistance(input, units);
		
		//if distance is negative, then we divide
		//if positive we multiply
		if(dist){
			var multiplier = Math.pow(1000, Math.abs(dist));
			if(dist > 0){
				result = num*multiplier;
			}
			else if(dist < 0){
				result = num/multiplier;
			}
		}
	}
	return result;
}

//extract the number from a string and keep it as str
Util.prototype.extractNumberStr = function(input){
	var result ='';
	if(input){
		var copy = input;
		var numb = copy.match(/[\d\.]+/g);
		result = numb.join('');
	}
	return result;
}

//extract the number from a string
function extractNumber(input){
	var result =0.0;
	if(input){
		var copy = input;
		var numb = copy.match(/[\d\.]+/g);
		result = numb.join('');
	}
	return result;
}



//detect the distance between the current unit and the "to" unit
function detectDistance(currUnit, toUnit){
	var diff =0;
	
	if(currUnit){
		if(toUnit){
			var fromVal = convertUnitToNumber(currUnit);
			var toVal = convertUnitToNumber(toUnit);	
			diff = fromVal-toVal;
		}
	}
	return diff;
}

//conver the unit to a number so we can standarize
function convertUnitToNumber(input){
	var result = 0;
	if(input){
		if(input.indexOf('G')>=0){
			result=3;
		}
		else if(input.indexOf('M')>=0){
			result=2;
		}
		else if(input.indexOf('K')>=0){
			result=1;
		}
		else if(input.indexOf('B')>=0){
			result=0;
		}
	}
	return result;
}

//splits a key value with 2 delimiters, putting the key at the front of the array
Util.prototype.splitKeyValue = function(line, firstDelim, secondDelim){
	var result=[];

	if(line){
		var splitKey=line.split(firstDelim);
		if(splitKey){
			result.push(splitKey[0]);

			if(splitKey.length > 1){
				for(var i=1; i<splitKey.length; i++){
					var temp = splitKey[i].trim();
					if(temp){
						var tempSplit = temp.split(secondDelim);
						if(tempSplit){
							//concat the results of tempsplit back on to result
							result = result.concat(tempSplit);
						}
					}
				}
			}
		}
	}
	return result;
}

//given a string, split into key value and return the value
Util.prototype.getValueFromKeyValueStr = function(input, delim){
	if(input){
		var keyValue = input.split(delim);
		if(keyValue && keyValue.length==2){
			return keyValue[1].trim().replace(/"/g,'');
		}
	}
	
	return '';
}

/**
 * Helper Methods
 */

Util.prototype.sendToAmazon = function(topic, results){
	if(results){
		var clientId = results.thingId;
		var message = JSON.stringify(results);
		
		console.log(message);

		var client = mqtt.connect(buildAWSClientParams(clientId));
		
		client.on('connect', function(){
			
			console.log('writing to ' + topic);
			client.publish(topic, message, buildPublishOptions());
			console.log('published');
			client.end();
		});
	}
	else{
		console.log('no results returned');
	}
}

function buildAWSClientParams(thingId){
	var clientParams = {};
	clientParams.host=AWS_ENDPOINT;
	clientParams.port=8883;
	clientParams.clientId=thingId;
	clientParams.key=fs.readFileSync(AWS_KEY);
	clientParams.cert=fs.readFileSync(AWS_CERT);
	clientParams.rejectUnauthorized=false;
	clientParams.requestCert=true;
	clientParams.ca=[fs.readFileSync(AWS_G5_CERT)];
	clientParams.protocol='mqtts';
  	clientParams.protocolId='MQIsdp';
  	clientParams.protocolVersion=3;
  	clientParams.secureProtocol='SSLv23_method';
	
	return clientParams;
}

function buildPublishOptions(){
	var options={};
	options.qos=0;
	options.retain = false;
	return options;
}
