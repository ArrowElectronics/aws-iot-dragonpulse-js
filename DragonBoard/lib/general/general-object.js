'use strict';

/**
 * Expose 'GeneralObject'
 */
module.exports = GeneralObject;

/**
 * Constructor
 * Initialize a new DiskObject
 */
function GeneralObject(){
	this.thingId='';
	this.timestamp= new Date().getTime();
	this.deviceType='unknown';
	this.os='';
	this.osVariant='';
	this.osVersion='';
	this.osCodename='';
	this.build='';
	this.architecture='';
}
