var gulp = require('gulp');
var gulp_handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var handlebars = require('./src/js/handlebars.js');

const deploy = "deploy/static/";

gulp.task('template', function(){
  gulp.src('src/templates/*.hbs')
    .pipe(gulp_handlebars({handlebars: handlebars})) // override library here
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

gulp.task('css', function(){
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest(deploy + 'css'))
});

gulp.task('sw', function(){
  return gulp.src('src/sw/*.js')
    .pipe(gulp.dest("deploy"))
});

gulp.task('settings', function(){
  return gulp.src('_redirects')
    .pipe(gulp.dest('deploy/'))
});

gulp.task('default', [ 'html', 'js', 'template', 'settings', 'sw', 'css']);