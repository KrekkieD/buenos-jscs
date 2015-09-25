# Buenos JSCS!

A NodeJS wrapper around the [JSCS](https://www.npmjs.com/package/jscs) code style checker, for your convenience.

Part of the buenos linting family: [buenos-jshint](https://www.npmjs.com/package/buenos-jshint), [buenos-jscs](https://www.npmjs.com/package/buenos-jscs), [buenos-htmllint](https://www.npmjs.com/package/buenos-htmllint).

## Installing

```
$ npm install --save-dev buenos-jscs 
```

## Usage

### In a node file

```
var $buenosJscs = require('buenos-jscs');

$buenosJscs(options);
```

### From your package.json

```
{
    "scripts": {
        "buenos-jscs": "buenos-jscs"
    }
}
```

```
$ npm run buenos-jscs
```

## Options

```
{

    /**
     * Optional. Array of reporters. Each reporter is called with the jscs results
     */
    reporters: [
    
        // a reporter can be an array where key 0 is the function 
        [ someFunction ],
        
        // a reporter can also be given a config variable
        [ someFunction, optionalConfig ],
        
        // a reporter may also be a direct function, not wrapped in an array
        someFunction,
        
        // default value:
        [ $buenosJscs.reporter, { path: './reports/buenos-jscs.json' }]
        
    ],
    
    
    /**
     * Optional. Globs using minimatch. default value:
     */
    src: [
        './**/*.js',
        '!./node_modules/**/*'
    ],
    
    
    /**
     * Optional. A configured jscs instance.
     * By default an instance is created and configured with registerDefaultRules()
     */
    jscs: new require('jscs'),
    
    
    /**
     * Optional. Jscs rules. May be:
     * - a file path to the rules json
     * - an object containing the rules
     * When left out it will follow this order to get its config:
     * - any parent package.json with a jscsConfig property
     * - a .jscsrc file in current folder or up
     * - a .jscs.json file in current folder or up
     * - embedded config (default)
     */
    jscsConfig: './myConfig.json'
}
```

## API

### BuenosJscs (class)

```
var $buenosJscs = require('buenos-jscs');

var instance = new $buenosJscs();
```

#### .log

The log object containing the status of the checked files.

#### .options

The parsed options object.

#### .checker

The configured [jscs](https://www.npmjs.com/package/jscs) instance. 

#### .promise

A promise that is resolved when the checker is complete. The `log` is provided as argument.

```
var $buenosJscs = require('buenos-jscs');

var instance = new $buenosJscs();
instance.promise.then(function (log) {
    // done processing!
    console.log(log);
});
```

### reporter

The default reporter. Useful in case you want to combine your own reporter with the default reporter.

```
var $buenosJscs = require('buenos-jscs');

new $buenosJscs({
    reporters: [
        [ $buenosJscs.reporter, { path: './reports/buenos-jscs.json' }],
        myReporter
    ]
});
```

### embeddedConfig

Returns the jscs config as embedded in the module.

```
var $buenosJscs = require('buenos-jscs');

console.log(
    $buenosJscs.embeddedConfig()
);
```

## Reporters

You can specify your own reporters. A reporter is called as a function, the first argument being the `log`, the
second argument being the reporter config (if defined).

```
var $buenosJscs = require('buenos-jscs');

new $buenosJscs({
    reporters: [
    
        // function, no config can be defined
        reporterWithoutConfig,
        
        // array of function, no config defined 
        [ reporterWithoutConfig ],
        
        // array of function and config obj
        [ reporterWithConfig, { myConfig: 'defined' } ]
    ]
});

function reporterWithoutConfig (log, config) {
    
    // log = BuenosJscs.log
    // config = undefined
    
}


function reporterWithConfig (log, config) {
    
    // log = BuenosJscs.log
    // config = { myConfig: 'defined' };
    
}
```

### Log format

```
{
    // where did the jscs config come from?
    "jscsConfig": "embedded", // embedded, custom, or file path
    
    // how many files are checked?
    "totalCount": 7,
    
    // how many files passed?
    "successCount": 7,
    
    // how many files failed?
    "failureCount": 0,
    
    // object of files checked
    "files": {
    
        // file name
        "index.js": {
        
            // how many errors were found in this file?
            "errorCount": 0,
            
            // array of errors found in this file
            "errors": [],
            
            // did the file pass the check?
            "passed": true
        },
        "lib/checker.js": {
            "errorCount": 0,
            "errors": [],
            "passed": true
        }
    }
}
```
