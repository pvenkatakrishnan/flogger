'use strict';
var pine = require('pine');

var fooLogger = function foo(config, appSpec, levels) {
    var pineConfig = {
            levels: levels,
            transports: config.transports
        },
        logger = pine('foo', pineConfig);

    return {
        log: function(label, level, info) {
            logger[level](JSON.stringify(info));
        }
    };
};

module.exports = fooLogger;