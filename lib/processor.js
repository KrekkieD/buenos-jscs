'use strict';

var $path = require('path');
var $fs = require('fs');

var $globby = require('globby');
var $q = require('q');

module.exports = Processor;

function Processor (buenosJscs) {

    var self = this;

    self.checkPath = checkPath;
    self.checkFile = checkFile;

    function checkPath () {

        return $globby(buenosJscs.options.src)
            .then(function (files) {

                var deferreds = [];

                files.forEach(function (file) {

                    deferreds.push(checkFile(file));

                });

                return $q.allSettled(deferreds);

            });

    }

    function checkFile (file) {

        return $q.nfcall($fs.readFile, file)
            .then(function (dataBuffer) {

                var errors = buenosJscs.checker.checkString(dataBuffer.toString(), file);

                var fileLog = logFileProcessed(file, {
                    errorCount: errors.getErrorCount(),
                    errors: errors.getErrorList()
                });

                // remove property 'additional' from errors, it may contain a recursive object preventing stringifying
                fileLog.errors.forEach(function (error) {
                    delete error.additional;
                });

                return fileLog.passed;

            });

    }

    function logFileProcessed (filePath, result) {

        buenosJscs.log.totalCount++;

        var fileDisplayName = $path.relative('.', filePath).split($path.sep).join('/');

        if (result.errorCount === 0) {
            result.passed = true;
            buenosJscs.log.successCount++;
        }
        else {
            buenosJscs.log.totalErrorCount += result.errorCount;
            result.passed = false;
            buenosJscs.log.failureCount++;
        }

        buenosJscs.log.files[fileDisplayName] = result;

        return result;

    }

}
