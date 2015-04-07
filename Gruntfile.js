module.exports = function(grunt) {
    var browsers = [{
        browserName: "chrome",
        version: "41.0",
        platform: "Windows 7"
    }, {
        browserName: "firefox",
        version: "36.0",
        platform: "Windows 7"
    }, {
        browserName: "safari",
        version: "7.0",
        platform: "OS X 10.9"
    }, {
        browserName: "iphone",
        version: "8.0",
        platform: "OS X 10.10",
        deviceName: "iPhone Simulator"
    }, {
        browserName: "android",
        version: "4.4",
        platform: "Linux",
        deviceName: "Android Emulator"
    }, {
        browserName: "internet explorer",
        version: "8",
        platform: "XP"
    }, {
        browserName: "internet explorer",
        version: "9",
        platform: "Windows 7"
    }, {
        browserName: "internet explorer",
        version: "10",
        platform: "Windows 7"
    }];

    grunt.initConfig({
        connect: {
          server: {
            options: {
              base: "",
              port: 9999
            }
          }
        },

        //
        // Sauce Jamsmine Tests
        //
        
        "saucelabs-jasmine": {
            all :{
                options: {
                    urls: ['http://127.0.0.1:9999/spec/SpecRunner.html'],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: 'yaks_plugins_tests',
                    tags: ['master']
                }
            }
        },

        // 
        // Local Jasmine Tests
        //
        
      jasmine: {
        pivotal: {
          // src: 'src/**/*.js',
          src: 'spec/yaks_plugins_build.js',
          options: {
            host: 'http://127.0.0.1:9999',
            
            specs: 'spec/yaks_plugins_test.js',
           }
         }
       },

        //
        // Dev watch taks
        //
        
        watch: {
            files: ['src/**/*.coffee', 'spec/yaks/**/*.coffee'],
            tasks: ['clean', 'coffee', 'browserify',  "jasmine"]
        },

        //
        // Build Test Files
        //
        
        browserify: {
           yaks: {
            files: {
             'spec/yaks_plugins_build.js': [
                 'spec/yaks_plugins/yaks_build.coffee',
             ],
             'spec/yaks_plugins_test.js': [
                 'spec/yaks_plugins/**/*.coffee'
             ]
            },
            options: {
              transform: ['coffeeify'],
            }
          },

        },
       
        //
        // Clean 'lib' folder
        //

        clean: {
          build: {
            src: [ 'lib' ]
          },
        },

        //
        // Build Coffee script
        //
       
        coffee: {
          build: {
            expand: true,
            options: {
              bare: true
            },
            cwd: 'src',
            src: [ '**/*.coffee' ],
            dest: 'lib',
            ext: '.js'
          }
        }
    });

    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
      if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }

    grunt.registerTask("dev", ["connect",  "watch"]);
    grunt.registerTask("test", [ "clean", "coffee", "browserify", "connect", "saucelabs-jasmine"]);
    grunt.registerTask("bundle", [ "clean", "coffee"]);
};
