var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['start'], function() {
  browserSync.init({
    proxy: "http://localhost:3002",
    port: 4000,
    browser: ['google chrome'],
    files: ["./public/**"]
  });
});
