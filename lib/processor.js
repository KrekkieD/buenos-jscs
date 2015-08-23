'use strict';

var $path = require('path');
var $fs = require('fs');

var $globStream = require('glob-stream');
var $q = require('q');

module.exports = Processor;

function Processor (buenosJscs) {

    var self = this;

    self.checkPath = checkPath;
    self.checkFile = checkFile;

    function checkPath () {

        var deferred = $q.defer();

        var stream = $globStream.create(buenosJscs.options.src);

        var deferreds = [];

        stream.on('data', function (file) {
            deferreds.push(checkFile(file.path));
        });

        stream.on('end', function () {

            $q.allSettled(deferreds)
                .then(function () {
                    deferred.resolve();
                });

        });

        return deferred.promise;

    }

    function checkFile (file) {

        var deferred = $q.defer();

        $fs.readFile(file, function (err, dataBuffer) {

            if (err) {
                throw err;
            }

            var errors = buenosJscs.checker.checkString(dataBuffer.toString(), file);

            var fileLog = logFileProcessed(file, {
                errorCount: errors.getErrorCount(),
                errors: errors.getErrorList()
            });

            return fileLog.passed ? deferred.resolve() : deferred.reject();

        });

        return deferred.promise;

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
