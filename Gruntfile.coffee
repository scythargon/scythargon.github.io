module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-testacular'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    meta:
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    coffeelint:
      src: 'main.coffee'
      options:
        max_line_length:
          level: 'ignore'
        line_endings:
          value: 'unix'
          level: 'error'
        no_stand_alone_at:
          level: 'error'
    clean:
      options:
        force: true
      build: ["main.js"]
    coffee:
      compile:
        files: [
          {
            expand: true
            cwd: './'
            src: 'main.coffee'
            dest: './'
            ext: '.js'
          }
        ],
        options:
          bare: true
    concat:
      options:
        banner: '<%= meta.banner %>'
      dist:
        src: 'main.js'
        dest: 'main.js'
    uglify:
      options:
        banner: '<%= meta.banner %>'
      dist:
        src: ['main.js']
        dest: 'main.min.js'
    watch:
      javascripts:
        files: 'main.coffee',
        tasks: [ 'javascripts' ]
        options:
          interrupt: false

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask 'javascripts', ['coffeelint', 'clean', 'coffee']
  grunt.registerTask 'default', ['javascripts', 'watch']
