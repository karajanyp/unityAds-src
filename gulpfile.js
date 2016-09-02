
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
    //base
    //DIR_SRC + '/js/base/wrap-before.js',
    DIR_SRC + '/js/base/CMD.js',
    DIR_SRC + '/js/base/compat.js',
    DIR_SRC + '/js/base/Promise.js',

    //ad unit
    DIR_SRC + '/js/adunit/AbstractAdUnit.js',
    DIR_SRC + '/js/adunit/AdUnitFactory.js',
    DIR_SRC + '/js/adunit/VastAdUnit.js',
    DIR_SRC + '/js/adunit/VideoAdUnit.js',
    DIR_SRC + '/js/adunit/eventhandlers/EndScreenEventHandlers.js',
    DIR_SRC + '/js/adunit/eventhandlers/OverlayEventHandlers.js',
    DIR_SRC + '/js/adunit/eventhandlers/VastOverlayEventHandlers.js',
    DIR_SRC + '/js/adunit/eventhandlers/VastVideoEventHandlers.js',
    DIR_SRC + '/js/adunit/eventhandlers/VideoEventHandlers.js',
    DIR_SRC + '/js/adunit/view/View.js',
    DIR_SRC + '/js/adunit/view/Privacy.js',
    DIR_SRC + '/js/adunit/view/Overlay.js',
    DIR_SRC + '/js/adunit/view/EndScreen.js',
    DIR_SRC + '/js/adunit/view/util/Tap.js',
    DIR_SRC + '/js/adunit/view/util/Template.js',
    DIR_SRC + '/js/adunit/vast/Vast.js',
    DIR_SRC + '/js/adunit/vast/VastAd.js',
    DIR_SRC + '/js/adunit/vast/VastCreative.js',
    DIR_SRC + '/js/adunit/vast/VastCreativeLinear.js',
    DIR_SRC + '/js/adunit/vast/VastMediaFile.js',

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

    //cache
    DIR_SRC + '/js/cache/CacheError.js',
    DIR_SRC + '/js/cache/CacheEvent.js',
    DIR_SRC + '/js/cache/CacheMode.js',
    DIR_SRC + '/js/cache/CacheStatus.js',
    DIR_SRC + '/js/cache/CacheManager.js',

    //campaign
    DIR_SRC + '/js/campaign/Campaign.js',
    DIR_SRC + '/js/campaign/CampaignManager.js',
    DIR_SRC + '/js/campaign/VastCampaign.js',

    //configuration
    DIR_SRC + '/js/configuration/Configuration.js',
    DIR_SRC + '/js/configuration/ConfigManager.js',

    //device
    DIR_SRC + '/js/device/AndroidStorageType.js',
    DIR_SRC + '/js/device/ClientInfo.js',
    DIR_SRC + '/js/device/DeviceInfo.js',
    DIR_SRC + '/js/device/ScreenOrientation.js',
    DIR_SRC + '/js/device/StreamType.js',
    DIR_SRC + '/js/device/UIInterfaceOrientationMask.js',

    //event
    DIR_SRC + '/js/event/EventManager.js',

    //metadata
    DIR_SRC + '/js/metadata/AdapterMetaData.js',
    DIR_SRC + '/js/metadata/FrameworkMetaData.js',
    DIR_SRC + '/js/metadata/MediationMetaData.js',
    DIR_SRC + '/js/metadata/PlayerMetaData.js',
    DIR_SRC + '/js/metadata/MetaDataManager.js',

    //model
    DIR_SRC + '/js/model/Model.js',

    //placement
    DIR_SRC + '/js/placement/Placement.js',
    DIR_SRC + '/js/placement/PlacementState.js',

    //platform
    DIR_SRC + '/js/platform/Platform.js',

    //request
    DIR_SRC + '/js/request/Request.js',
    DIR_SRC + '/js/request/RequestEvent.js',

    //resolve
    DIR_SRC + '/js/resolve/Resolve.js',
    DIR_SRC + '/js/resolve/ResolveEvent.js',

    //session
    DIR_SRC + '/js/session/Session.js',
    DIR_SRC + '/js/session/SessionManager.js',
    DIR_SRC + '/js/session/SessionManagerEventMetadataCreator.js',

    //storage
    DIR_SRC + '/js/storage/StorageError.js',
    DIR_SRC + '/js/storage/StorageType.js',

    //util
    DIR_SRC + '/js/util/Diagnostics.js',
    DIR_SRC + '/js/util/DOMParser.js',
    DIR_SRC + '/js/util/Double.js',
    DIR_SRC + '/js/util/JsonParser.js',
    DIR_SRC + '/js/util/Observable.js',
    DIR_SRC + '/js/util/Url.js',
    DIR_SRC + '/js/util/VastParser.js',

    //wakeup
    DIR_SRC + '/js/wakeup/WakeUpManager.js',

    //webview
    DIR_SRC + '/js/webview/WebView.js',
    DIR_SRC + '/js/webview/EventCategory.js',
    DIR_SRC + '/js/webview/bridge/BatchInvocation.js',
    DIR_SRC + '/js/webview/bridge/CallbackContainer.js',
    DIR_SRC + '/js/webview/bridge/CallbackStatus.js',
    DIR_SRC + '/js/webview/bridge/IosWebViewBridge.js',
    DIR_SRC + '/js/webview/bridge/NativeBridge.js',
    //main
    DIR_SRC + '/js/AdsError.js',
    DIR_SRC + '/js/FinishState.js',
    DIR_SRC + '/js/main.js',

    //DIR_SRC + '/js/base/wrap-after.js'
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
