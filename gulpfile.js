var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var through2   = require('through2');

function string2js () {
	return through2.obj(function(file, encoding, callback) {
		var res = file.contents.toString();
		res = res.replace(/\n/g, '').replace(/\'/g, '\\\'');
		res = 'module.exports = \'' + res + '\'';
		file.contents = new Buffer(res);
		file.path = file.path + '.js';
		this.push(file);
		callback();
	});
}

gulp.task('buildStatic', function() {
	gulp.src('./static/*').pipe(string2js()).pipe(gulp.dest('./js'));
});
gulp.task('buildJs', function() {
	gulp.src('./js/index.js').pipe(browserify()).pipe(uglify()).pipe(gulp.dest('./'));
});
gulp.task('watch', ['build'], function() {
	gulp.watch(['./**/*', '!./js/*.css.js', '!./js/*.html.js'], ['build']);
});

gulp.task('build',      ['buildStatic', 'buildJs']);
gulp.task('default',    ['watch', 'build']);



