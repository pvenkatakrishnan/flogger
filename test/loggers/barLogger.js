'use strict';
var pine = require('pine');

var barLogger = function bar(config, appSpec, levels) {
    var pineConfig = {
            levels: levels,
            transports: config.transports
        },
        logger = pine('bar', pineConfig);

    return {
        log: function(label, level, info) {
            //convert data into required format
            logger[level](JSON.stringify(info));
        }
    };
};

module.exports = barLogger;