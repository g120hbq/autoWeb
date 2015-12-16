var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');
var less = require('gulp-less');
var merge = require('merge2');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var path=require('path');
var sourcemaps = require('gulp-sourcemaps');
var colors = require('colors/safe');
gulp.task("default", ["clean"], function () {
    console.log('gulp default');
    gulp.start('typescript','less');
});
//清理废弃文件
gulp.task("clean", [], function () {
     return gulp.src(['dist/css/*.css','dist/js/*.js'], {read: false})
          .pipe(clean({force: true}));
});
//编译typescript TS文件
gulp.task("typescript", [], function () {
    gutil.log(colors.red('开始编译typescript...'));
    var tsResult = gulp.src(['client/ts/*.ts'])
        .pipe(ts({
            declaration: true,
            noExternalResolve: true
        }));
    return merge([
        tsResult.dts.pipe(gulp.dest('client/ts-release-definitions')),
        tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

//编译less文件
gulp.task('less', function () {
    gutil.log(colors.red('开始编译less...'));
    return gulp.src('client/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'dist', 'css')]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch',function(){
    gulp.watch('client/less/*.less',['styles']);
    gulp.watch('client/ts/*.ts',['scripts']);
    //gulp.watch('views/*.jade',['templates']);
})