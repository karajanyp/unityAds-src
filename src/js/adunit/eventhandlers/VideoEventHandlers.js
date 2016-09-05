/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VideoEventHandlers", function (require) {
    var ScreenOrientation = require("device.ScreenOrientation");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var AdsError = require("AdsError");
    var FinishState = require("FinishState");
    var StorageType = require("storage.StorageType");
    var Double = require("util.Double");
    var adUnitProperties = require("Properties").adUnit;

    function VideoEventHandlers() {
    }
    VideoEventHandlers.isVast = function (adUnit) {
        return void 0 !== adUnit.getVast;
    };
    VideoEventHandlers.onVideoPrepared = function (nativeBridge, adUnit, duration) {
        var me = this, overlay = adUnit.getOverlay();
        adUnit.setVideoDuration(duration);
        overlay.setVideoDuration(duration);
        if(adUnit.getVideoPosition() > 0 ){
            overlay.setVideoProgress(adUnit.getVideoPosition());
        }
        if(adUnit.getPlacement().allowSkip()){
            overlay.setSkipVisible(true);
        }
        overlay.setMuteEnabled(true);
        overlay.setVideoDurationEnabled(true);
        if(this.isVast(adUnit) && adUnit.getVideoClickThroughURL()){
            overlay.setCallButtonVisible(true);
        }
        nativeBridge.Storage.get(StorageType.PUBLIC, "test.debugOverlayEnabled.value").then(function (e) {
            if (e === true) {
                overlay.setDebugMessageVisible(true);
                var msg = me.isVast(adUnit) ? "Programmatic Ad" : "Performance Ad";
                overlay.setDebugMessage(msg);
            }
        });
        nativeBridge.VideoPlayer.setVolume(new Double(overlay.isMuted() ? 0 : 1)).then(function () {
            if(adUnit.getVideoPosition() > 0 ){
                nativeBridge.VideoPlayer.seekTo(adUnit.getVideoPosition()).then(function () {
                    nativeBridge.VideoPlayer.play();
                })
            }else{
                nativeBridge.VideoPlayer.play();
            }
        });
    };
    VideoEventHandlers.onVideoProgress = function (nativeBridge, sessionManager, adUnit, i) {
        sessionManager.sendProgress(adUnit, sessionManager.getSession(), i, adUnit.getVideoPosition());
        if (i > 0) {
            var r = adUnit.getVideoPosition();
            if(r > 0 && 100 > i - r ){
                adUnit.getOverlay().setSpinnerEnabled(true)
            }else{
                adUnit.getOverlay().setSpinnerEnabled(false);
            }
            var o = adUnit.getVideoQuartile();
            adUnit.setVideoPosition(i);
            if(0 === o && 1 === adUnit.getVideoQuartile() ){
                sessionManager.sendFirstQuartile(adUnit)
            }else if(1 === o && 2 === adUnit.getVideoQuartile() ){
                sessionManager.sendMidpoint(adUnit)
            }else if(2 === o && 3 === adUnit.getVideoQuartile() ){
                sessionManager.sendThirdQuartile(adUnit);
            }
        }
        adUnit.getOverlay().setVideoProgress(i);
    };
    VideoEventHandlers.onVideoStart = function (nativeBridge, sessionManager, adUnit) {
        sessionManager.sendImpressionEvent(adUnit);
        sessionManager.sendStart(adUnit);
        adUnit.getOverlay().setSpinnerEnabled(false);
        nativeBridge.VideoPlayer.setProgressEventInterval(250);
        if(0 === adUnit.getWatches()){
            nativeBridge.Listener.sendStartEvent(adUnit.getPlacement().getId());
        }
        adUnit.newWatch();
    };
    VideoEventHandlers.onVideoCompleted = function (nativeBridge, sessionManager, adUnit) {
        adUnit.setVideoActive(!1);
        adUnit.setFinishState(FinishState.COMPLETED);
        sessionManager.sendView(adUnit);
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.IosAdUnit.setViews(["webview"])
        }else{
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        this.afterVideoCompleted(nativeBridge, adUnit);
        nativeBridge.Storage.get(StorageType.PUBLIC, "integration_test.value").then(function (t) {
            if(t){
                if(nativeBridge.getPlatform() === Platform.ANDROID){
                    nativeBridge.rawInvoke(adUnitProperties.ANDROID_INTEGRATION_TEST_CLASS, "onVideoCompleted", [adUnit.getPlacement().getId()])
                }else{
                    nativeBridge.rawInvoke(adUnitProperties.IOS_INTEGRATION_TEST_CLASS, "onVideoCompleted", [adUnit.getPlacement().getId()]);
                }
            }
        });
    };
    VideoEventHandlers.onVideoError = function (nativeBridge, adUnit, i, a) {
        adUnit.setVideoActive(!1);
        adUnit.setFinishState(FinishState.ERROR);
        nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.VIDEO_PLAYER_ERROR], "Video player error");
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.Sdk.logError("SDK video player error");
            nativeBridge.IosAdUnit.setViews(["webview"]);
        }else{
            nativeBridge.Sdk.logError("video player error " + i + " " + a);
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        adUnit.getOverlay().hide();
        var s = adUnit.getEndScreen();
        s && adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
    };
    VideoEventHandlers.afterVideoCompleted = function (nativeBridge, adUnit) {
        adUnit.getOverlay().hide();
        adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
        if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.AndroidAdUnit.setOrientation(ScreenOrientation.SCREEN_ORIENTATION_FULL_SENSOR)
        }else if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.IosAdUnit.setSupportedOrientations(UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_ALL);
        }
    };

    return VideoEventHandlers;
});
