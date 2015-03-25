var gulp            = require('gulp');
var browserify      = require('gulp-browserify');
var uglify          = require('gulp-uglify');
var webserver       = require('gulp-webserver');
var gutil           = require('gulp-util');
var chinese2unicode = require('fd-gulp-chinese2unicode');

gulp.task('build', function() {
	gulp.src('./src/index.js')
		.pipe(browserify().on('error', gutil.log))
		.pipe(uglify())		
		.pipe(chinese2unicode())
		.pipe(gulp.dest('./dest'));
});
gulp.task('watch', ['build'], function() {
	gulp.watch(['./src/*'], ['build']);
	gulp.src('./').pipe(webserver({
		livereload: true,
		directoryListing: true
    }));
});

gulp.task('default', ['watch', 'build']);



