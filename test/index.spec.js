'use strict';

var $path = require('path');

var $upTheTree = require('up-the-tree');
var $buenosJscs = require('..');

var projectRoot = $upTheTree();
var testFilesRoot = $path.resolve(projectRoot, 'test/resources/srcFiles');


describe('index.js', function () {

    it('should be able to override config', function () {

        var instance = $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.reporters).toEqual(false);

    });

    it('should be able to instantiate without using the "new" keyword', function () {

        var instance = $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(typeof instance.promise !== 'undefined').toEqual(true);

    });



});
