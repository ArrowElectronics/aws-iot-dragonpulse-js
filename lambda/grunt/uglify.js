'use strict';

module.exports = {
  monitor: {
    src: [ '<%= browserify.monitor.dest %>' ],
    dest: 'dist/monitor/monitor.js'
  },
  things: {
    src: [ '<%= browserify.things.dest %>' ],
    dest: 'dist/things/things.js'
  }
};