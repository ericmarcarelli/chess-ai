module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    vars: {
      assetsDir: '.'
    },

    shell: {
      bower: {
        command: 'bower install'
      }
    },

    bower_concat: {
      all: {
        dest: '<%= vars.assetsDir %>/js/_plugins.js',
        cssDest: '<%= vars.assetsDir %>/css/_plugins.css',
        exclude: [
          'breakpoint-sass',
          'sassy-maps',
          'compass-mixins'
        ]
      }
    },

    // Grunt-sass
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= vars.assetsDir %>/scss',
          src: ['*.scss'],
          dest: '<%= vars.assetsDir %>/css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        // outputStyle: 'compressed',
        outputStyle: 'expanded',
        imagePath: '<%= vars.assetsDir %>/images/'
      }
    },

    // Watch the source folder for changes and re-run 'build'
    watch: {
      styles: {
        files: ['<%= vars.assetsDir %>/**/*.scss'],
        tasks: ['sass']
      },
      // php: {
      //   files: ['<%= vars.assetsDir %>/**/*.php']
      // },
      js: {
        files: ['<%= vars.assetsDir %>/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('build', 'Build the site', function() {
    grunt.task.run('shell:bower');
    grunt.task.run('bower_concat');
    grunt.task.run('sass');
  });

  grunt.registerTask('dev', '', function() {
    grunt.task.run('build');
    grunt.task.run('watch');
  });
};
