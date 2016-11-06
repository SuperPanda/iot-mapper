module.exports = function(grunt){



  grunt.initConfig({
      //les: ['Gruntfile.js', 'js/*.js', '!bower_components/**/*.js'],
      options: {
        globals: {
          jQuery: false,
          console: true,
          module: true,
          document: true
        }
      },
    jshint: {
      files: ['Gruntfile.js', 'js/*.js', '!bower_components/**/*.js'],
      options: {
        globals: {
          jQuery: false,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['%= jshint.files %>'],
      tasks: ['jshint']
    }});
 
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-karma');

  //grunt.registerTask('test', ['jshint','karma']);
  //grunt.registerTask('default', ['jshint','karma','concat','uglify']);
  grunt.registerTask('default', ['jshint']);

};
