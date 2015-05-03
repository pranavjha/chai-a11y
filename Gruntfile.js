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
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    'jshint'
  ]);
  grunt.registerTask('document', [
    'docco'
  ]);
};
