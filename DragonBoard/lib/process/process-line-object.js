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
	//removed nice and priority for now (pretty useless)
	//cannot be non-empty
	//this.nice=-1;
	//this.priority=-1;
}