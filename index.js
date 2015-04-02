'use strict';

var npmDefaults =  {
        'silly': true,
        'debug': true,
        'verbose': true,
        'info': true,
        'warn': true,
        'error': true
    },
    pluckHelper = require('./lib/plucker'),
    path = require('path');

module.exports = function logger(config, logspec) {

    var logHelpers = {},
        plucker,
        pluckedInfo;

    if (logspec) {
        plucker = pluckHelper(logspec);
    }

    function setup(level) {
        return function log(eventId, info, tag) {
            var args;
            if(arguments.length < 3) {
                tag = info;
                info = eventId;
                eventId = null;
            }
            args = {
                level: level,
                tag: tag
            };

            pluckedInfo = (plucker && eventId) ? plucker.pluck(eventId, info) : info;

            if(this.wrapper) {
                this.wrapper(pluckedInfo, function(finalInfo) {
                    args.info = finalInfo;
                    _log(args);

                });
            } else {
                args.info = pluckedInfo;
                _log(args);
            }
        };
    }


    function _log(args) {
        var level = args.level,
            tag = args.tag,
            info = args.info,
            label = args.label;

        function f(entry) {
            return function(elem) {
                if (elem === entry) return false;
                return true;
            };

        }

        function intersect(arr1, arr2) {
            var obj = arr1.reduce(function(o, v, i) {
                    o[v] = true;
                    return o;
                }, {}),
                result = [];
            arr2.forEach(function(entry) {

                if (obj[entry]) {
                    result.push(entry);
                }
            });
            return result;
        }

        Object.keys(config.type).forEach(function(type) {
            var tags = config.type[type].level[level];
            if (tags) {
                //revisit figuring out whether string or array
                if (tags === '*' || tags === tag) {
                    logHelpers[type].log(tag, level, info);
                } else if(Array.isArray(tags)) {
                    if(!Array.isArray(tag)) {
                        if(!tags.every(f(tag))){
                            logHelpers[type].log(tag, level, info);
                        }
                    } else if(intersect(tag, tags).length > 0) {
                        logHelpers[type].log(tag, level, info);
                    }
                } else if(Array.isArray(tag) && !tag.every(f(tags))) {
                    logHelpers[type](tag, level, info);
                }
                //no logging since this log unit did not require logging
            }
        });
    }

    function _enable(logger, level, doEnable) {
        logger[level] = doEnable ? setup(level) : function() {};
    }

    //enable logging levels
    var levels = npmDefaults;
    if(config.levels) {
        Object.keys(config.levels).forEach(function(key) {
            if (levels[key] !== config.levels[key]) {
                levels[key] = config.levels[key];
            }
        });
    }

    //setting up
    Object.keys(config.type).forEach(function(key) {
        var module;
        try {
            module = require(config.type[key].module);
        } catch (e) {
            module = require(path.join(process.cwd(), config.type[key].module));
        }
        logHelpers[key] = module(config.type[key], logspec, levels);
    });

    function Logger(wrapper) {
        this.wrapper = wrapper;
    }

    Logger.prototype.enable = function (level, doEnable) {
        this[level] = doEnable ? setup(level) : function() {};
    };

    Object.keys(levels).forEach(function(level) {
        Logger.prototype[level] = setup(level)
    });

    return {
        create: function(wrapper) {
            return new Logger(wrapper);
        }
    };
};


