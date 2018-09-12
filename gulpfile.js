"use strict";

/************************
 * SETUP
 ************************/

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sassdoc = require('sassdoc');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');
var pump = require('pump');
var log = require('fancy-log');
var colors = require('ansi-colors');
var bs = require('browser-sync').create(); 

/************************
 * CONFIGURATION
 ************************/

var autoReload = true;

var paths = {
  npmDir: './node_modules'
};

var includePaths = [
  // Add paths to any sass @imports that you will use from bower_components here
  // Adding paths.bowerDir will allow you to target any bower package folder as an include path
  // for generically named assets
  paths.npmDir + '/foundation-sites/scss'
];

var stylesSrc = [
  // add bower_components CSS here
  './sass/style.scss'
];

var sassdocSrc = [
  './sass/base/*.scss',
  './sass/layout/*.scss',
  './sass/components/*.scss'
];

var scriptsSrc = [
  // add bower_component scripts here
  paths.npmDir + '/foundation-sites/js/foundation.core.js',

  paths.npmDir + '/foundation-sites/js/foundation.util.mediaQuery.js',

  './js/lib/foundation-init.js',
  './js/src/*.js'
];

/************************
 * TASKS
 ************************/

// Compile styles
function styles(done) {
  gulp.src(stylesSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: includePaths
    }))

    // Catch any SCSS errors and prevent them from crashing gulp
    .on('error', function (error) {
      console.error(error);
      this.emit('end');
    })
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 11'))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(livereload())
    .pipe(cleanCss({
      compatibility: 'ie11'
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(livereload());

    done();
}

// Compile sassdocs
function sassdoc(done) {
  return gulp.src(sassdocSrc)
    .pipe(sassdoc());

  done();
}

// Compile scripts
function scripts(done) {
  gulp.src(scriptsSrc)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('theme.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./js/dist/'))
    .pipe(livereload())
    .pipe(uglify())
    .on('error', function (err) { log.error(err.toString()); })
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./js/dist/'))
    .pipe(livereload());

  done();
}

// Run browser sync
function bsync(done) {
  bs.init({
    server: {
      baseDir: "./"
    }
  });

  done();
}

// Start watcher
function watch(done) {
  if (autoReload) {
    livereload.listen();
  }
  gulp.watch('./sass/**/*.scss', ['styles', 'wysiwyg']);
  gulp.watch('./js/src/*.js', ['scripts']);

  done();
}

gulp.task(scripts);
gulp.task(styles);
gulp.task(sassdoc);
gulp.task(bsync);
gulp.task(watch);

const defaultCompile = gulp.parallel(scripts, styles);
gulp.task('default', defaultCompile);
// gulp.task('default', ['styles', 'scripts']);

// gulp.task('default', gulp.series(['styles', 'scripts']));
