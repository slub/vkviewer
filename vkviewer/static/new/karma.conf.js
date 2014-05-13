// Karma configuration
// Generated on Tue Apr 01 2014 11:23:29 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine','closure'],


    // list of files / patterns to load in the browser
    files: [
	'lib/ol.js',
	'lib/jquery.min.js',
	'lib/jquery-ui.min.js',
	'lib/jquery.tablesorter.min.js',
	'../lib/closure-library/closure/goog/base.js',
	'test/mochups/*.moch.js',
	'test/spec/**/*.test.js',
	{pattern: 'src/**/*.js', included: false},
	{pattern:'../lib/closure-library/closure/goog/deps.js', included: true, served: true}
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
	'test/**/*.js':['closure', 'closure-iit'],
	'src/**/*.js':['closure'],
	'../lib/closure-library/closure/goog/deps.js': ['closure-deps']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
