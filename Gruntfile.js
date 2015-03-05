module.exports = function(grunt) {
  grunt.initConfig({

    'http-server': {

      // the server root directory
      root: './',

      port: 8282,
      // port: function() { return 8282; }

      host: "127.0.0.1",

      cache: '<sec>',
      showDir : true,
      autoIndex: true,
      defaultExt: "html",

      // run in parallel with other tasks
      runInBackground: false
    }
  });
  grunt.loadNpmTasks('grunt-http-server');
}
