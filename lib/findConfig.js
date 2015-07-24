'use strict';

var $fs = require('fs');

var $upTheTree = require('up-the-tree');

module.exports = findConfig;

/**
 * Find config in the following order:
 * - jscsConfig option in consumer package.json
 * - .jscsrc JSON file
 * - .jscs.json file
 * - provide embedded config
 */
function findConfig () {

    var foundConfig;

    var finders = [
        _packageJson,
        _jscsrc,
        _jscsJson,
        _embedded
    ];

    while (!foundConfig && finders.length) {
        foundConfig = finders.shift()();
    }

    if (!foundConfig) {
        // screwed. should not happen.
        throw 'Oops. Could not find a config, and embedded config also appears to be missing?';
    }

    return foundConfig;

}

function _packageJson () {

    var path = $upTheTree.resolve('package.json');

    if (path) {
        var packageJson = JSON.parse($fs.readFileSync(path).toString());

        if (packageJson.hasOwnProperty('jscsConfig')) {
            return {
                source: path,
                config: packageJson.jscsConfig
            };
        }
    }

    return false;
}

function _jscsrc () {

    var path = $upTheTree.resolve('.jscsrc');

    if (path) {
        return {
            source: path,
            config: JSON.parse($fs.readFileSync(path).toString())
        };
    }

    return false;

}

function _jscsJson () {

    var path = $upTheTree.resolve('.jscs.json');

    if (path) {

        return {
            source: path,
            config: JSON.parse($fs.readFileSync(path.toString()))
        };
    }

    return false;

}

function _embedded () {

    var path = $upTheTree.resolve('resources/defaultConfiguration.json', {
        start: __dirname
    });

    return {
        source: 'embedded',
        config: JSON.parse($fs.readFileSync(path.toString()))
    };

}
