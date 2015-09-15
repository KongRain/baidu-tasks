var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourceMaps = require('gulp-sourcemaps');
var amdOptimize = require('amd-optimize');
var browserSync = require('browser-sync');

/*static server*/
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			//指定服务器启动根目录
			baseDir: '.'
		}
	});
	//监听变化，实时刷新页面
	gulp.watch('./**/*.*').on('change', browserSync.reload);
});

/* less to css */
gulp.task('less', function() {
	gulp.src('src/less/index.less')
		.pipe(less())
		/*.pipe(minifyCSS())*/
		.pipe(gulp.dest('dist/css'));
});

/* js compress*/
gulp.task('compress', function() {
	gulp.src('src/js/requireJS/*.js')
		.pipe(amdOptimize('index'))
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

/* fonts */
gulp.task('fonts', function() {
	gulp.src('src/fonts/*')
		.pipe(gulp.dest('dist/fonts/'));
});

/* watch */
gulp.task('watch', function() {
	gulp.watch('src/less/*.less', ['less']);
	gulp.watch('src/js/requireJS/*.js', ['compress']);
	gulp.watch('src/fonts/*', ['fonts']);
});



/* default */
gulp.task('default', function() {
	gulp.start('less', 'compress', 'fonts');
});