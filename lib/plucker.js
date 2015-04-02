'use strict';

var fastpath = require('fastpath');

module.exports = function plucker(appSpec) {
    var store = {};
    Object.keys(appSpec).forEach(function (specKey) {
        store[specKey] = fastpath(appSpec[specKey]);
    });
    return {
        pluck: function(id, obj) {
            return (store[id])? store[id].evaluate(obj) : obj;
        }
    };
}