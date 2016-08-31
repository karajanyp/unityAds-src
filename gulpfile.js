
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    es = require('event-stream');

//公共配置
/*-- 以下路径为相对路径，相对于gulpfile.js --*/
var DIR_SRC = "src";
var DIR_DIST = "dist";
/*-- 以上路径为相对路径，相对于gulpfile.js --*/

//待合并的JS文件
var comboFileList = [
    DIR_SRC + '/js/wrap-before.js',
    DIR_SRC + '/js/extend.js',
    DIR_SRC + '/js/wrap-after.js'
];

gulp.task("default", ["inline-dist"]);
gulp.task("inline", ["concat"], function () {
    gulp.src(DIR_SRC + '/unityAds.html')
        .pipe(plugins.inline({
            base: DIR_SRC,
            disabledTypes: ['svg', 'img'] // Only inline css & js files
        }))
        .pipe(gulp.dest(DIR_DIST + '/'));
});
gulp.task("inline-dist", ["concat"], function () {
    gulp.src(DIR_SRC + '/unityAds.html')
        .pipe(plugins.inline({
            base: DIR_SRC,
            js: plugins.uglify,
            css: plugins.minifyCss,
            disabledTypes: ['svg', 'img'] // Only inline css & js files
        }))
        .pipe(gulp.dest(DIR_DIST + '/'));
});

gulp.task("concat", ["clean"], function () {
    return gulp.src(comboFileList)
        .pipe(plugins.concat('core-combo.js'))
        .pipe(gulp.dest(DIR_SRC + "/lib/"));
});

gulp.task("clean", function () {
    return es.merge(gulp.src(DIR_DIST, {read: false}));
});

gulp.task("watch", function(){
    gulp.watch([DIR_SRC + "/*.html", DIR_SRC + "/js/*.js", DIR_SRC + "/css/*.css"], function(file){
        console.log("\n<<- detect file "+file.type+"-------->>");
        console.log("<<- "+file.path+" ->>");
        gulp.run("inline");
    });
});
