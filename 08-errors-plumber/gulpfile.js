'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {

  return gulp.src('frontend/styles/main.styl')
      .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'Styles',
          message: err.message
        }))
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(stylus())
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulp.dest('public'));

});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
      .pipe(debug({title: 'assets'}))
      .pipe(gulp.dest('public'));
});


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);