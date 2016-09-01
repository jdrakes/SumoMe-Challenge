var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('nodemon');

gulp.task('start', function() {
  nodemon({
    script: './bin/www.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
});
