'use strict';

var $fs = require('fs');
var $path = require('path');

var $sortedObject = require('sorted-object');
var $mkdirp = require('mkdirp');

module.exports = reporter;

function reporter (log, options) {

    $mkdirp.sync($path.relative('.', $path.dirname(options.path)));

    // sort the files object by key for more consistent output
    var files = log.files;
    var sortedFiles = $sortedObject(files);
    log.files = sortedFiles;

    $fs.writeFileSync(options.path, JSON.stringify(log, null, 4));

    console.log('BuenosJscs Code Style results:');

    if (log.totalErrorCount === 0) {
        console.log('    ' + [
            'Checked',
            log.totalCount,
            'files, all files passed with no errors.'
        ].join(' '));
    }
    else {
        console.log('    ' + [
            'Checked',
            log.totalCount,
            'files, found a grand total of',
            log.totalErrorCount,
            'errors in',
            log.failureCount,
            'files'
        ].join(' '));

    }


    console.log('    Report written to ' + $path.relative('.', options.path));

}
