module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        resourcePath: "app",
        less: {
            development: {
                options: {
                    paths: ["<%= resourcePath %>/styles"]
                },
                files: {
                    "<%= resourcePath %>/styles/main.css": "<%= resourcePath %>/styles/main.less",
                }
            }
        },
        watch: {
            less: {
                files: "<%= resourcePath %>/styles/**/*.less",
                tasks: ['less']
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['less']);
};
