'use strict';

var bulkify = require('bulkify');

var defaultBrowserifyOptions = {
  standalone: 'lambda',
  browserField: false,
  builtins: false,
  commondir: false,
  detectGlobals: true,
  insertGlobalVars: {
    // Handle process https://github.com/substack/node-browserify/issues/1277
    process: function() {
    }
  }
};

module.exports = {
  options: {
    browserifyOptions: defaultBrowserifyOptions,
    exclude: [ 'aws-sdk' ]
  },
  monitor: {
    src: [ 'lib/lambda/monitor/handler.js' ],
    dest: 'dist/monitor/monitor.bundled.js',
    options: {
      browserifyOptions: defaultBrowserifyOptions,
      exclude: [ 'aws-sdk' ],
      transform: [ bulkify ]
    }
  },
  things: {
    src: [ 'lib/lambda/things/handler.js' ],
    dest: 'dist/things/things.bundled.js'
  }
};
