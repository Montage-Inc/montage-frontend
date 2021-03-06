var gulp = require('gulp');

var cssmin     = require('gulp-cssmin');
var del        = require('del');
var gulpif     = require('gulp-if');
var htmlmin    = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var uglify     = require('gulp-uglify');
var useref     = require('gulp-useref');

var path = require('../paths.js');


gulp.task('pre-build', ['compile-scripts', 'copy-libs', 'compile-sass', 'copy-all', 'inject-templates']);

gulp.task('make-build', function() {
	var htmlminOptions = {
		removeComments: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		collapseBooleanAttributes: true,
		removeEmptyAttributes: true,
		removeScriptTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	};

	return gulp.src(path.to.destination + 'index.html')
		.pipe(useref({ searchPath: [path.to.destination] }))
		.pipe(gulpif('static/app.js', ngAnnotate()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cssmin({ keepSpecialComments: 0 })))
		.pipe(gulpif('*.html', htmlmin(htmlminOptions)))
		.pipe(gulp.dest(path.to.destination));
});

gulp.task('post-build', function() {
	var sourceFiles = [].concat(
		path.to.templates.destination,
		path.to.scripts.destination,
		path.to.libs.destination,
		path.to.destination + 'templates.js',
		path.to.sass.destination + 'app.css'
	);

	return del(sourceFiles);
});
