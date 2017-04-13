var gulp = require('gulp');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

const deploy = "deploy/static/";

gulp.task('template', function(){
  gulp.src('src/templates/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'CTF.pages',
      noRedeclare: true // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(deploy + 'js'));
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