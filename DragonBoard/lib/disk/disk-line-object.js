'use strict';

/**
 * Expose 'DiskLineObject'
 */
module.exports = DiskLineObject;

/**
 * Constructor
 * Initialize a new DiskLineObject
 */
function DiskLineObject(){
	this.filesystem='';
	this.fSize='';
	this.used='';
	this.available='';
	this.usage=0;
	this.mounted='';
}