'use strict';

var $path = require('path');

var $upTheTree = require('up-the-tree');
var $buenosJscs = require('..');

var projectRoot = $upTheTree();
var testFilesRoot = $path.resolve(projectRoot, 'test/resources/srcFiles');


describe('findConfig', function () {

    it('should find config in package.json', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/packageJson');
        process.chdir(configDir);

        var instance = new $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jscsConfig.source).toEqual($path.resolve(configDir, 'package.json'));

    });

    it('should find config in .jscsrc', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/jscsrc');
        process.chdir(configDir);

        var instance = new $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jscsConfig.source).toEqual($path.resolve(configDir, '.jscsrc'));

    });

    it('should find config in .jscs.json', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/jscsJson');
        process.chdir(configDir);

        var instance = new $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jscsConfig.source).toEqual($path.resolve(configDir, '.jscs.json'));

    });

    it('should find embedded config', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/embedded');
        console.log(configDir);
        process.chdir(configDir);

        var instance = new $buenosJscs({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jscsConfig.source).toEqual('embedded');

    });

});
