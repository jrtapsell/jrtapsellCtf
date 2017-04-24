'use strict';

var gulp = require('gulp');
var gulp_handlebars = require('gulp-handlebars');
var header = require('gulp-header');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var htmlhint = require("gulp-htmlhint");
var ts = require('gulp-typescript');
var handlebars = require('handlebars');
var sass = require('gulp-sass');
var deploy = "deploy/static/";

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

gulp.task('app', function(){
  return gulp.src('src/app/*')
    .pipe(gulp.dest(deploy + 'app'))
});

gulp.task('img', function(){
  return gulp.src('src/img/*')
    .pipe(gulp.dest(deploy + 'img'))
});

gulp.task('js', function(){
  return gulp.src('src/js/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest(deploy + 'js'))
});

gulp.task('css', function(){
  return gulp.src('src/css/*.css')
    //.pipe(cleanCSS())
    .pipe(gulp.dest(deploy + 'css'))
});

gulp.task('sw', function(){
  return gulp.src('src/sw/*.js')
    .pipe(header("/* Compiled on " + (new Date()).toString() + ". */"))
    .pipe(gulp.dest("deploy"))
});

gulp.task('settings', function(){
  return gulp.src('_redirects')
    .pipe(gulp.dest('deploy/'))
});

gulp.task('js_lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js_lint_sw', function() {
  return gulp.src('src/sw/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('css_lint', function() {
  return gulp.src('src/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter());
});


gulp.task('scss', function () {
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(deploy + 'css'));
});

gulp.task('ts', function() {
  return gulp.src('src/js/*.ts')
    .pipe(ts({
      target:'ES6'
    }))
    .pipe(gulp.dest(deploy + "js"));
});

// or requiring in ES5
var tslint = require("gulp-tslint");

gulp.task("tslint", function () {
    return gulp.src("src/js/*.ts")
      .pipe(tslint())
      .pipe(tslint.report())
});

gulp.task('default', [ 'html', 'ts', 'template', 'settings', 'sw', 'scss', 'app', 'img']);
gulp.task('lint', ['js_lint_sw', 'css_lint', 'tslint']);