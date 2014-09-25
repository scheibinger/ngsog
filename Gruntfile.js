module.exports = function (grunt) {
  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      app: 'app',
      dist: 'dist'
    },
    less: {
      development: {
        options: {
          paths: ["<%= yeoman.app %>/styles"]
        },
        files: {
          "<%= yeoman.app %>/styles/main.css": "<%= yeoman.app %>/styles/main.less",
        }
      }
    },
    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml,_config.build.yml',
        src: '<%= yeoman.app %>'
      },
      dist: {
        options: {
          dest: '<%= yeoman.dist %>',
        }
      },
      server: {
        options: {
          config: '_config.yml',
          dest: '.jekyll'
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },
    watch: {
      less: {
        files: "<%= yeoman.app %>/styles/**/*.less",
        tasks: ['less']
      },
      jekyll: {
        files: [
          '<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown,css,js}',
          '!<%= yeoman.app %>/_bower_components/**/*'
        ],
        tasks: ['jekyll:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.jekyll/**/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
          '{.tmp,<%= yeoman.app %>}/<%= scripts %>/**/*.js',
          '<%= yeoman.app %>/images/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '.jekyll',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= yeoman.dist %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            '.jekyll',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= yeoman.dist %>/*',
              // Running Jekyll also cleans the target directory.  Exclude any
              // non-standard `keep_files` here (e.g., the generated files
              // directory from Jekyll Picture Tag).
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: [
        '.tmp',
        '.jekyll'
      ]
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            src: [
              // Jekyll processes and moves HTML and text files.
              // Usemin moves CSS and javascript inside of Usemin blocks.
              // Copy moves asset files and directories.
              'images/**/*',
              'styles/**/*',
              'scripts/**/*',
              // Like Jekyll, exclude files & folders prefixed with an underscore.
              '!**/_*{,/**}'
              // Explicitly add any files your site needs for distribution here.
              //'_bower_components/jquery/jquery.js',
              //'favicon.ico',
              //'apple-touch*.png'
            ],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    concurrent: {
      server: [
        'jekyll:server'
      ],
      dist: [
        'copy:dist'
      ]
    },

    // Various Grunt tasks...

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%',
        silent: true
      },
      pages: {
        options: {
          remote: 'git@github.com:scheibinger/ngsog.git',
          branch: 'gh-pages'
        }
      },
      local: {
        options: {
          remote: '../',
          branch: 'build'
        }
      }
    }

  });

  // Default task(s).
  grunt.registerTask('default', ['less']);

  // Define Tasks
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean',
    // Jekyll cleans files from the target directory, so must run first
    'jekyll:dist',
    'concurrent:dist'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'buildcontrol:pages'
  ]);
};
