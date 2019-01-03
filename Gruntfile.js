module.exports = function (grunt) {
    grunt.loadTasks('./tasks');

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        configPath: [
            process.cwd() + '/tasks/options'
        ],
    });


    console.log()

    //production build, we deploy this
    grunt.registerTask('dist', [
        'clean:dist',
        // 'copy:dist',
        'webpack:dist'
    ]);

    //Development build, used for testing. Starts filewatcher and webserver
    grunt.registerTask('dev', [
        // 'copy:dev',
        'connect:server',
        'webpack:dev'
    ]);
};
