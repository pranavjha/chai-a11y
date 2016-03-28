'use strict';
var path = require('path');
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
module.exports = function(grunt) {
    // loading the npm task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-docco-plus');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            '.coverage',
            '.test',
            '.cache'
        ],
        copy: {
            coverage: {
                src: 'lib/**',
                dest: '.coverage/instrument/',
                // Copy if file does not exist.
                filter: function(filepath) {
                    // Construct the destination file path.
                    var dest = path.join(
                        grunt.config('copy.coverage.dest'),
                        path.relative(process.cwd(), filepath)
                    );
                    // Return false if the file exists.
                    return !(grunt.file.exists(dest));
                }
            }
        },
        jshint: {
            lib: {
                src: [
                    'lib/**/*.js',
                    'test/**/*.js',
                    'Gruntfile.js',
                    'package.json'
                ],
                options: jshintOptions
            }
        },
        karma: {
            testAMD: {
                frameworks: [
                    'requirejs',
                    'mocha',
                    'chai'
                ],
                files: [
                    {
                        src: [
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
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js'
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
            coverageAMD: {
                frameworks: [
                    'requirejs',
                    'mocha',
                    'chai'
                ],
                files: [
                    {
                        src: [
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
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js'
                        ],
                        served: true,
                        included: false
                    }
                ],
                plugins: [
                    'karma-requirejs',
                    'karma-coverage',
                    'karma-chai',
                    'karma-mocha',
                    'karma-mocha-reporter',
                    'karma-phantomjs-launcher'
                ],
                preprocessors: {
                    'lib/**/*.js': [
                        'coverage'
                    ]
                },
                reporters: [
                    'mocha',
                    'coverage'
                ],
                coverageReporter: {
                    dir: '.coverage',
                    reporters: [
                        {
                            type: 'json',
                            subdir: 'json/amd'
                        },
                        {
                            type: 'html',
                            subdir: 'html/amd'
                        }
                    ]
                }
            },
            testCommonJs: {
                frameworks: [
                    'lasso',
                    'mocha'
                ],
                lasso: {
                    minify: false,
                    bundlingEnabled: false,
                    cacheProfile: 'development',
                    tempdir: '.test',
                    ignore: 'node_modules/a11y-auditor/**'
                },
                files: [
                    {
                        src: [
                            'test/commonjs-specs.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js'
                        ]
                    }
                ],
                plugins: [
                    'karma-chai',
                    'karma-mocha',
                    'karma-lasso',
                    'karma-mocha-reporter',
                    'karma-phantomjs-launcher'
                ]
            },
            coverageCommonJs: {
                frameworks: [
                    'lasso',
                    'mocha'
                ],
                lasso: {
                    minify: false,
                    bundlingEnabled: false,
                    cacheProfile: 'development',
                    tempdir: '.coverage',
                    ignore: 'node_modules/a11y-auditor/**',
                    coverage: {
                        files: '**/*.js',
                        reporters: [
                            {
                                type: 'json',
                                dir: '.coverage/json/common'
                            },
                            {
                                type: 'html',
                                dir: './.coverage/html/common'
                            }
                        ]
                    }
                },
                files: [
                    {
                        src: [
                            'test/commonjs-specs.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js'
                        ]
                    }
                ],
                plugins: [
                    'karma-chai',
                    'karma-mocha',
                    'karma-lasso',
                    'karma-mocha-reporter',
                    'karma-phantomjs-launcher'
                ],
                reporters: [
                    'mocha',
                    'lasso'
                ]
            },
            testScriptTag: {
                frameworks: [
                    'mocha',
                    'chai'
                ],
                files: [
                    {
                        src: [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js',
                            'lib/index.js',
                            'test/script-tag-specs.js'
                        ]
                    }
                ],
                plugins: [
                    'karma-chai',
                    'karma-mocha',
                    'karma-mocha-reporter',
                    'karma-phantomjs-launcher'
                ],
                client: {
                    mocha: {
                        ui: 'bdd'
                    }
                }
            },
            coverageScriptTag: {
                frameworks: [
                    'mocha',
                    'chai'
                ],
                files: [
                    {
                        src: [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/a11y-auditor/dist/a11y-auditor.min.js',
                            'lib/index.js',
                            'test/script-tag-specs.js'
                        ]
                    }
                ],
                plugins: [
                    'karma-chai',
                    'karma-mocha',
                    'karma-coverage',
                    'karma-mocha-reporter',
                    'karma-phantomjs-launcher'
                ],
                preprocessors: {
                    'lib/**/*.js': [
                        'coverage'
                    ]
                },
                reporters: [
                    'mocha',
                    'coverage'
                ],
                coverageReporter: {
                    dir: '.coverage',
                    reporters: [
                        {
                            type: 'json',
                            subdir: 'json/tag'
                        },
                        {
                            type: 'html',
                            subdir: 'html/tag'
                        }
                    ]
                },
                client: {
                    mocha: {
                        ui: 'bdd'
                    }
                }
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
                singleRun: true,
                reporters: [
                    'mocha'
                ],
                logLevel: 'WARN'
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
        instrument: {
            files: [
                'lib/node.js'
            ],
            options: {
                lazy: false,
                basePath: '.coverage/instrument/'
            }
        },
        storeCoverage: {
            options: {
                dir: '.coverage/json/'
            }
        },
        makeReport: {
            src: '.coverage/json/**/*.json',
            options: {
                type: 'lcov',
                dir: '.coverage/reports/',
                print: 'detail'
            }
        },
        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '.coverage/instrument/'
            }
        },
        'docco-plus': {
            debug: {
                src: [
                    'lib/**',
                    'test/**',
                    '*.js',
                    '*.md'
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
                repo: 'https://' + process.env.GH_TOKEN + '@github.com/' + process.env.TRAVIS_REPO_SLUG + '.git',
                clone: '.gh_pages',
                message: 'build #' + process.env.TRAVIS_BUILD_NUMBER + ' travis commit',
                // This configuration will suppress logging and sanitize error messages.
                silent: true,
                user: {
                    name: 'travis',
                    email: 'travis@travis-ci.com'
                }
            },
            src: [
                '**'
            ]
        },
        coveralls: {
            lcov: {
                // LCOV coverage file relevant to every target
                src: '.coverage/reports/lcov.info'
            }
        }
    });
    grunt.registerTask('test', [
        'clean',
        'jshint',
        'mochaTest:test',
        'karma:testAMD',
        'karma:testCommonJs',
        'karma:testScriptTag'
    ]);
    grunt.registerTask('coverage', [
        'clean',
        'instrument',
        'env:coverage',
        'copy:coverage',
        'mochaTest',
        'storeCoverage',
        'karma:coverageAMD',
        'karma:coverageCommonJs',
        'karma:coverageScriptTag',
        'makeReport',
        'coveralls:lcov'
    ]);
    grunt.registerTask('document', [
        'docco-plus'
    ]);
};
