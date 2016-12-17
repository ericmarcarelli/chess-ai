module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    vars: {
      sourceDir: '.',
      destDir: '_site'
    },

    shell: {
      bower: {
        command: 'bower install'
      }
    },

    bower_concat: {
      all: {
        dest: '<%= vars.destDir %>/js/_plugins.js',
        cssDest: '<%= vars.destDir %>/css/_plugins.css',
        exclude: [
          'breakpoint-sass',
          'sassy-maps',
          'compass-mixins'
        ]
      }
    },

    // specific files specified to control order
    concat: {
      options: {
        separator: ";"
      },
      dist: {
        src: ['<%= vars.sourceDir %>/js/chessai.js', '<%= vars.sourceDir %>/js/board.js', '<%= vars.sourceDir %>/js/options.js', '<%= vars.sourceDir %>/js/state.js'],
        dest: '<%= vars.destDir %>/js/chessai.js'
      },
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= vars.sourceDir %>/scss',
          src: ['*.scss'],
          dest: '<%= vars.destDir %>/css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        // outputStyle: 'compressed',
        outputStyle: 'expanded',
        imagePath: '<%= vars.sourceDir %>/images/'
      }
    },

    copy: {
      main: {
        files: [
          { expand: true, cwd: '.', src: ['*.html', 'img/**/*', 'img/*', '.htaccess', 'fonts/*.*', '!scss/**', '!img/*.psd', '!db/**', '!*.config.php'], dest: '<%= vars.destDir %>/' }
        ]
      }
    },

    clean: {
      files: ['<%= vars.destDir %>/*']
    },

    watch: {
      styles: {
        files: ['<%= vars.sourceDir %>/**/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['<%= vars.sourceDir %>/**/*.js'],
        tasks: ['concat']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('build', 'Build the site', function() {
    grunt.task.run('shell:bower');
    grunt.task.run('clean');
    grunt.task.run('bower_concat');
    grunt.task.run('concat');
    grunt.task.run('sass');
    grunt.task.run('copy');
  });

  grunt.registerTask('dev', '', function() {
    grunt.task.run('build');
    grunt.task.run('watch');
  });
};
