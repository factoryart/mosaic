module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    coffee:
      default:
        files:
          "dist/mosaic.js": "src/mosaic.coffee"

    watch:
      js:
        files: [
          "src/mosaic.coffee"
        ]
        tasks: [ "js" ]
        options: nospawn: on

    uglify:
      js:
        files: [
          "dist/min/mosaic.min.js": "dist/mosaic.js"
        ]


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  # Default tasks
  grunt.registerTask "default", [ "downloads" ]

  grunt.registerTask "js", "Compile coffeescript", [ "coffee" ]

  grunt.registerTask "downloads", "Compile all coffeescript files and generate the download files", [ "js", "uglify" ]