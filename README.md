# flogger
----------

A logging pattern.

### Usage
Configurations for your logger:
```
//logging config

{
    "logging": {
        "type": {
            "fooLogger": {
                "level": {
                    "error": "*",
                    "info": ["business", "services"]
                },
                "transports": {
                    "file":  {
                        "filename": "./test/foo_log.txt"
                    },
                    "console": {
                        "level": "error"
                    }
                },
                "module": "fooLogger"
            }
        }
    }
}

//app specific config

{
    "txSearch": {
        "startDate": "$.search.startDate",
        "endDate": "$.search.endDate",
        "size": "$.search.activities.length",
        "mostRecent": "$.search.activities[0].timeStamp",
        "transactions": "$.search.activities[*].transactionId"
    },
    "finIns": {
        "numCards": "$.finIns.cards.length",
        "bankNames": "$.finIns.banks[*].name",
        "accountNumbers": "$.finIns.banks[*].accounts[*].accountNumber",
        "isCreditEnabled": "$.finIns.balance.isCreditEnabled"
    }
}

```

To setup your logger

```
var doBeforeLog = function(data, finish) {
        //insert anything extra before final data is logged
        finish(data);
}

var log = logger(config.logging, logSpec).create(doBeforeLog);
log.info('txSearch',obj, ['UI', 'business']);
//log.error etc
```


### Supported

 * Mechanism to plug-in various logging modules
 * Customized tags (for grouping different kinds of logging)
 * Customized levels (apart from default ones from npm like silly, debug, log, info, warn, error) eg: adding `log.foo`
 * Simple Initialization: `var log = logger(logConfig, appSpec);`
 * Simple Usage: `log.<level>(<eventId>, <data>, <tag>)` eg: `log.info('finIns' , obj, 'business');`
 * Easy Enable/Disable logging level eg. `logger.enable('debug', false)` disables log.debug for everything.
 * Extract interesting things from an object given a jsonpath.
 * Capability to interpolate interesting data from `req` or similar without passing it around.

