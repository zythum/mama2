var source     = require("vinyl-source-stream")
var buffer     = require('vinyl-buffer');
var chalk      = require("chalk")
var gulp       = require("gulp")
var gutil      = require("gulp-util")
var rename     = require("gulp-rename")
var sourcemaps = require("gulp-sourcemaps")
var browserify = require("browserify")
var watchify   = require("watchify")
var uglify     = require("gulp-uglify")
var c2u        = require('fd-gulp-chinese2unicode');
var webserver  = require('gulp-webserver');

function map_error(err) {
  if (err.fileName) {
    // regular error
    return gutil.log(chalk.red(err.name)
      + ": "
      + chalk.yellow(err.fileName.replace(__dirname + "/src/", ""))
      + ": "
      + "Line "
      + chalk.magenta(err.lineNumber)
      + " & "
      + "Column "
      + chalk.magenta(err.columnNumber || err.column)
      + ": "
      + chalk.blue(err.description))
  } else {
    // browserify error..
    return gutil.log(chalk.red(err.name)
      + ": "
      + chalk.yellow(err.message))
  }
}

function bundle(bundler) {
  return bundler.bundle()
    .on("error", map_error)

    .pipe(source("index_no_uglify.js"))
    .pipe(buffer())
    .pipe(c2u())
    .pipe(gulp.dest("./dest"))
    .pipe(rename("index.js"))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify().on("error", map_error))
    .pipe(c2u()) //uglify 还会吧文字导回来。所以还要来一次
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dest"))
}

gulp.task('build', function () {
  bundle(browserify('./src/index.js', { extensions: ['.js'], debug: true }))
})

gulp.task("watch", function() {
  var bundler = watchify(browserify("./src/index.js"))
  bundle(bundler);
  bundler.on("update", function () { bundle(bundler) })
  bundler.on("log", function (msg) { gutil.log("watchify:", msg) })
   gulp.src('./').pipe(webserver({
   livereload: true,
   directoryListing: true
    }))
})

gulp.task("default", ["build", "watch"])
