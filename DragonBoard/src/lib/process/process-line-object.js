'use strict';

/**
 * Expose 'ProcessLineObject'
 */
module.exports = ProcessLineObject;

/**
 * Constructor
 * Initialize a new ProcessLineObject
 */
function ProcessLineObject(direction){
	this.pid='';
	this.command='';
	this.cpu=0.0;
	this.ttime='';
	this.memory='';
	this.state='';
	this.user='-';
}