'use strict';
// js-hint options. See the complete list of options [here](http://jshint.com/docs/options/)
var jshintOptions = {
  nonew: true,
  plusplus: true,
  curly: true,
  latedef: true,
  maxdepth: 6,
  unused: true,
  noarg: true,
  trailing: true,
  indent: 4,
  forin: true,
  noempty: true,
  quotmark: true,
  maxparams: 6,
  node: true,
  eqeqeq: true,
  strict: true,
  undef: true,
  bitwise: true,
  newcap: true,
  immed: true,
  camelcase: true,
  maxcomplexity: 7,
  maxlen: 120,
  nonbsp: true,
  freeze: true
};
module.exports = function (grunt) {
  // loading the npm task
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: [
      '.coverage',
      '.test',
      '.cache'
    ],
    jshint: {
      lib: {
        src: [
          'lib/**/*.js',
          'Gruntfile.js',
          'package.json'
        ],
        options: jshintOptions
      }
    },
    karma: {
      testAMD: {
        reporters: [
          'mocha'
        ],
        frameworks: [
          'requirejs',
          'mocha',
          'chai'
        ],
        files: [
          {
            src: [
              'node_modules/accessibility-developer-tools/dist/js/axs_testing.js',
              'node_modules/requirejs/require.js',
              'test/require-config.js'
            ],
            served: true,
            included: true
          },
          {
            src: [
              'test/amd-specs.js',
              'lib/**/*.js',
              'node_modules/jquery/dist/jquery.js'
            ],
            served: true,
            included: false
          }
        ],
        plugins: [
          'karma-requirejs',
          'karma-chai',
          'karma-mocha',
          'karma-mocha-reporter',
          'karma-phantomjs-launcher'
        ]
      },
      testCommonJs: {
        reporters: [
          'mocha'
        ],
        frameworks: [
          'optimizer',
          'mocha'
        ],
        optimizer: {
          minify: false,
          bundlingEnabled: false,
          cacheProfile: 'development',
          tempdir: '.test',
          ignore: 'node_modules/accessibility-developer-tools/**'
        },
        files: [
          {
            src: [
              'test/commonjs-specs.js',
              'node_modules/accessibility-developer-tools/dist/js/axs_testing.js'
            ]
          }
        ],
        plugins: [
          'karma-chai',
          'karma-mocha',
          'karma-optimizer',
          'karma-mocha-reporter',
          'karma-phantomjs-launcher'
        ]
      },
      options: {
        browsers: [
          'PhantomJS'
        ],
        client: {
          mocha: {
            timeout: 500,
            ui: 'bdd'
          }
        },
        singleRun: true
      }
    },
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/nodejs-specs.js'
        ]
      }
    },
    docco: {
      debug: {
        src: [
          'lib/**',
          'README.md'
        ],
        options: {
          output: '.docs/'
        }
      }
    },
    'gh-pages': {
      options: {
        base: '.docs',
        // GH_TOKEN is the environment variable holding the access token for the repository
        repo: 'https://' + process.env.GH_TOKEN + '@github.com/pranavjha/chai-a11y.git',
        clone: '.gh_pages',
        message: 'auto commit chai-a11y on <%= grunt.template.today("yyyy-mm-dd") %>',
        // This configuration will suppress logging and sanitize error messages.
        silent: true,
        user: {
          name: 'Pranav Jha',
          email: 'jha.pranav.s@gmail.com'
        }
      },
      src: [
        '**'
      ]
    }
  });
  grunt.registerTask('test', [
    'jshint',
    'mochaTest',
    'karma'
  ]);
  grunt.registerTask('document', [
    'docco'
  ]);
};
