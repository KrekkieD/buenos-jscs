'use strict';

var $reporter = require('./lib/reporter');
var $findConfig = require('./lib/findConfig');
var $processor = require('./lib/processor');

var $path = require('path');
var $fs = require('fs');

var $jscs = require('jscs');
var $extend = require('extend');

module.exports = BuenosJscs;
module.exports.reporter = $reporter;
module.exports.embeddedConfig = embeddedConfig;

var DEFAULT_CONFIG = {
    reporters: [
        [$reporter, { path: './reports/jscs.json' }]
    ],
    src: [
        './**/*.js',
        '!./node_modules/**/*'
    ]
};

function BuenosJscs (options) {

    var self = this;

    self.options = _checkOptions(options);

    self.log = {
        jscsConfig: self.options.jscsConfig.source,
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        files: {}
    };

    var processor = new $processor(self);
    self.checker = self.options.jscs;

    self.promise = processor.checkPath()
        .then(function () {

            if (Array.isArray(self.options.reporters)) {
                self.options.reporters.forEach(function (reporter) {

                    if (Array.isArray(reporter)) {
                        reporter[0](self.log, reporter[1]);
                    }
                    else if (typeof reporter === 'function') {
                        reporter(self.log);
                    }
                    else {
                        throw 'Reporter should be a function or array of function (and options)';
                    }

                });
            }

            return self.log;

        });


    function _checkOptions (options) {

        options = $extend({}, options || {}, DEFAULT_CONFIG);

        if (!options.jscs) {
            options.jscs = new $jscs();
            options.jscs.registerDefaultRules();
        }

        if (!options.jscsConfig) {
            options.jscsConfig = $findConfig();
        }
        else if (typeof options.jscsConfig === 'string') {
            // must be a path to a config file.. try to read it
            try {
                options.jscsConfig = {
                    source: $path.resolve(options.jscsConfig),
                    config: JSON.parse($fs.readFileSync($path.resolve(options.jscsConfig)).toString())
                };
            } catch (e) {
                throw 'Could not read config file at ' + options.jscsConfig;
            }
        }
        else {
            options.jscsConfig = {
                source: 'custom',
                config: options.jscsConfig
            };
        }

        if (options.jscsConfig) {
            options.jscs.configure(options.jscsConfig.config);
        }

        return options;

    }

}

function embeddedConfig () {

    return JSON.parse($fs.readFileSync($path.resolve(__dirname, 'resources/defaultConfiguration.json')).toString());

}

// execute when not imported
if (!module.parent) {
    module.exports();
}
