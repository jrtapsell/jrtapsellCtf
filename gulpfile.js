var gulp = require('gulp');
var header = require('gulp-header');

const deploy = "deploy/static/";

gulp.task('template', function() {
  return gulp.src('src/templates/*.html')
    .pipe(header('<!--TEMPLATE-->\n'))
    .pipe(gulp.dest(deploy + 'templates'))
});

gulp.task('html', function(){
  return gulp.src('src/html/*.html')
    .pipe(gulp.dest(deploy + 'html'))
});

gulp.task('js', function(){
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest(deploy + 'js'))
});

gulp.task('sw', function(){
  return gulp.src('src/sw.js')
    .pipe(gulp.dest('deploy/'))
});

gulp.task('sw-installer', function(){
  return gulp.src('src/sw-installer.js')
    .pipe(gulp.dest('deploy/'))
});

gulp.task('settings', function(){
  return gulp.src('_redirects')
    .pipe(gulp.dest('deploy/'))
});

gulp.task('default', [ 'html', 'js', 'template', 'settings', 'sw', 'sw-installer']);