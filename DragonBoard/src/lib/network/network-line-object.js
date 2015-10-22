'use strict';

/**
 * Expose 'NetworkLineObject'
 */
module.exports = NetworkLineObject;

/**
 * Constructor
 * Initialize a new NetworkLineObject
 */
function NetworkLineObject(direction){
	this.ip='';
	this.nPort='';
	this.direction=direction;
	this.tier1='';
	this.tier2='';
	this.tier3='';
	this.cummulative='';
}