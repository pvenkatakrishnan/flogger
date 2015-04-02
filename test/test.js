'use strict';
var logger = require('../index'),
    logSpec = require('./fixtures/appLogging'),
    config = require('./fixtures/config'),
    test = require('tape');

test('logger', function (t) {

    t.test('should be able to create a logger', function (t) {
        var log = logger(config.logging, logSpec).create();
        t.equal(typeof log.enable, 'function');
        t.equal(typeof log.error, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.debug, 'function');
        t.end();
    });

    t.test('should be abe to enable specific logging types', function(t) {
        var log = logger(config.logging, logSpec).create();
        t.equal(typeof log.joke, 'function');
        log.enable('joke', false);
        t.equal('' + log.joke, '' + function() {});
        t.end();
    });

    t.test('should be able to create a specific stream for loggers', function(t) {
        var log = logger(config.logging, logSpec).create(),
            obj = {
                search: {
                    startDate: '12-01-2012',
                    endDate: '12-25-2012',
                    activities: [
                        {transactionId: 111, name: 'a', timeStamp: '123456' },
                        {transactionId: 222, name: 'b', timeStamp: '123457' },
                        {transactionId: 333, name: 'c', timeStamp: '123458' },
                        {transactionId: 444, name: 'd', timeStamp: '123459' }
                    ]
                },
                finIns: {
                    cards: [ {name: 'Chase'}, {name: 'CaptialOne'}, {name: 'BankOfAmerica'}],
                    banks: [
                        {
                            name: 'WellsFargo',
                            accounts: [
                                {
                                    accountNumber: '123'
                                },
                                {
                                    accountNumber: '456'
                                }
                            ]
                        },
                        {
                            name: 'Bank Of America',
                            accounts: [
                                {
                                    accountNumber: '789'
                                }
                            ]
                        }
                    ],
                    balance: {
                        isCreditEnabled: true
                    }

                }

            };
        log.error('txSearch', obj);
        log.info('finIns' , obj, 'business');
        log.info('finIns', obj, 'joke');
        log.info('txSearch',obj, ['joke', 'business']);
        log.joke('txSearch', obj, ['UI']);
        t.end();
    });

    t.test('should be able to addCommon additional data before logging', function(t) {
        var wrapper = function wrapper(data, callback) {
            data.correlationId = '12345';
            callback(data);
        };
        var log = logger(config.logging, logSpec).create(wrapper),
            obj = {
                search: {
                    startDate: '12-01-2012',
                    endDate: '12-25-2012',
                    activities: [
                        {transactionId: 111, name: 'a', timeStamp: '123456' },
                        {transactionId: 222, name: 'b', timeStamp: '123457' },
                        {transactionId: 333, name: 'c', timeStamp: '123458' },
                        {transactionId: 444, name: 'd', timeStamp: '123459' }
                    ]
                },
                finIns: {
                    cards: [ {name: 'Chase'}, {name: 'CaptialOne'}, {name: 'BankOfAmerica'}],
                    banks: [
                        {
                            name: 'WellsFargo',
                            accounts: [
                                {
                                    accountNumber: '123'
                                },
                                {
                                    accountNumber: '456'
                                }
                            ]
                        },
                        {
                            name: 'Bank Of America',
                            accounts: [
                                {
                                    accountNumber: '789'
                                }
                            ]
                        }
                    ],
                    balance: {
                        isCreditEnabled: true
                    }

                }

            };
        log.error('txSearch', obj);
        log.info('finIns' , obj, 'business');
        log.info('finIns', obj, 'joke');
        log.info('txSearch',obj, ['joke', 'business']);
        log.joke('txSearch', obj, ['UI']);
        t.end();
    });


});
