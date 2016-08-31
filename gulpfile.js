
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
    DIR_SRC + '/js/util.js',

    DIR_SRC + '/js/platform/Platform.js',
    DIR_SRC + '/js/webview/bridge/IosWebViewBridge.js',

    //ad unit
    //api
    DIR_SRC + '/js/api/AndroidAdUnitApi.js',
    DIR_SRC + '/js/api/AndroidDeviceInfoApi.js',
    DIR_SRC + '/js/api/AndroidVideoPlayerApi.js',
    DIR_SRC + '/js/api/AppSheetApi.js',
    DIR_SRC + '/js/api/BroadcastApi.js',
    DIR_SRC + '/js/api/CacheApi.js',
    DIR_SRC + '/js/api/ConnectivityApi.js',
    DIR_SRC + '/js/api/DeviceInfoApi.js',
    DIR_SRC + '/js/api/IntentApi.js',
    DIR_SRC + '/js/api/IosAdUnitApi.js',
    DIR_SRC + '/js/api/IosDeviceInfoApi.js',
    DIR_SRC + '/js/api/IosVideoPlayerApi.js',
    DIR_SRC + '/js/api/ListenerApi.js',
    DIR_SRC + '/js/api/NativeApi.js',
    DIR_SRC + '/js/api/NotificationApi.js',
    DIR_SRC + '/js/api/PlacementApi.js',
    DIR_SRC + '/js/api/RequestApi.js',
    DIR_SRC + '/js/api/ResolveApi.js',
    DIR_SRC + '/js/api/SdkApi.js',
    DIR_SRC + '/js/api/StorageApi.js',
    DIR_SRC + '/js/api/UrlSchemeApi.js',
    DIR_SRC + '/js/api/VideoPlayerApi.js',

    //app sheet
    DIR_SRC + '/js/appsheet/AppSheetEvent.js',
    //broadcast
    //cache
    DIR_SRC + '/js/cache/CacheError.js',
    DIR_SRC + '/js/cache/CacheEvent.js',
    //configuration
    //connectivity
    //device
    DIR_SRC + '/js/device/AndroidStorageType.js',
    //log
    //metadata
    //placement
    DIR_SRC + '/js/placement/Placement.js',
    DIR_SRC + '/js/placement/PlacementState.js',
    //platform
    DIR_SRC + '/js/platform/Platform.js',
    //properties
    //request
    DIR_SRC + '/js/request/RequestEvent.js',
    //resolve
    DIR_SRC + '/js/resolve/FinishState.js',
    DIR_SRC + '/js/resolve/ResolveEvent.js',
    //storage
    DIR_SRC + '/js/storage/StorageError.js',
    DIR_SRC + '/js/storage/StorageType.js',
    //util
    DIR_SRC + '/js/util/Observable.js',
    DIR_SRC + '/js/util/Promise.js',
    DIR_SRC + '/js/util/Url.js',
    //video
    //webview
    DIR_SRC + '/js/webview/EventCategory.js',
    DIR_SRC + '/js/webview/bridge/BatchInvocation.js',
    DIR_SRC + '/js/webview/bridge/CallbackContainer.js',
    DIR_SRC + '/js/webview/bridge/CallbackStatus.js',
    DIR_SRC + '/js/webview/bridge/IosWebViewBridge.js',
    DIR_SRC + '/js/webview/bridge/NativeBridge.js',
    //main
    DIR_SRC + '/js/main.js',
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
    gulp.run("inline");
    gulp.watch([DIR_SRC + "/*.html", DIR_SRC + "/js/*.js", DIR_SRC + "/css/*.css"], function(file){
        console.log("\n<<- detect file "+file.type+"-------->>");
        console.log("<<- "+file.path+" ->>");
        gulp.run("inline");
    });
});
