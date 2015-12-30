'use strict';

/* The tasks are relatively the same and while not technically correct, the approach will prevent
 * unnecessary maintenance.
 */
module.exports = {
  monitor: '<%= zip.monitor.dest %>',
  things: '<%= zip.things.dest %>'
};