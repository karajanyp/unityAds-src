/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.VideoAdUnit", function (require) {
    var AbstractAdUnit = require("adunit.AbstractAdUnit");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var Double = require("util.Double");
    var FinishState = require("FinishState");
    var ScreenOrientation = require("device.ScreenOrientation");

    function VideoAdUnit(nativeBridge, placement, campaign, overlay, endScreen) {
        var me = this;
        AbstractAdUnit.call(this, nativeBridge, placement, campaign);
        if(nativeBridge.getPlatform() === Platform.IOS){
            this._onViewControllerDidAppearObserver = this._nativeBridge.IosAdUnit.onViewControllerDidAppear.subscribe(function () {
                return me.onViewDidAppear();
            })
        }else{
            this._activityId = VideoAdUnit._activityIdCounter++;
            this._onResumeObserver = this._nativeBridge.AndroidAdUnit.onResume.subscribe(function (e) {
                return me.onResume(e);
            });
            this._onPauseObserver = this._nativeBridge.AndroidAdUnit.onPause.subscribe(function (e, t) {
                return me.onPause(e, t);
            });
            this._onDestroyObserver = this._nativeBridge.AndroidAdUnit.onDestroy.subscribe(function (e, t) {
                return me.onDestroy(e, t);
            });
        }
        this._videoPosition = 0;
        this._videoQuartile = 0;
        this._videoActive = true;
        this._watches = 0;
        this._overlay = overlay;
        this._endScreen = endScreen;
    }
    extend(VideoAdUnit, AbstractAdUnit);
    VideoAdUnit.prototype.show = function () {
        var me = this;
        this._showing = true;
        this.onStart.trigger();
        this.setVideoActive(true);
        if (this._nativeBridge.getPlatform() === Platform.IOS) {
            var n = this._iosOptions.supportedOrientations;
            this._placement.useDeviceOrientationForVideo() ||
            (this._iosOptions.supportedOrientations & UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE) !== UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE || (n = UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE);
            this._onNotificationObserver = this._nativeBridge.Notification.onNotification.subscribe(function (t, n) {
                return me.onNotification(t, n);
            });
            this._nativeBridge.Notification.addNotificationObserver(VideoAdUnit._audioSessionInterrupt, ["AVAudioSessionInterruptionTypeKey", "AVAudioSessionInterruptionOptionKey"]);
            this._nativeBridge.Notification.addNotificationObserver(VideoAdUnit._audioSessionRouteChange, []);
            this._nativeBridge.Sdk.logInfo("Opening game ad with orientation " + n);
            return this._nativeBridge.IosAdUnit.open(["videoplayer", "webview"], n, true, true);
        }
        var orientation = this._androidOptions.requestedOrientation;
        if(!this._placement.useDeviceOrientationForVideo()){
            orientation = ScreenOrientation.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;
        }
        var keyevents = [];
        if(this._placement.disableBackButton()){
            keyevents = [4];
            this._onBackKeyObserver = this._nativeBridge.AndroidAdUnit.onKeyDown.subscribe(function (t, n, i, r) {
                return me.onKeyEvent(t);
            });
        }
        var acceleration = true;
        if(this._nativeBridge.getApiLevel() < 17 ){
            acceleration = false;
        }
        this._nativeBridge.Sdk.logInfo("Opening game ad with orientation " + orientation + ", hardware acceleration " + (acceleration ? "enabled" : "disabled"));
        return this._nativeBridge.AndroidAdUnit.open(this._activityId, ["videoplayer", "webview"], orientation, keyevents, 1, acceleration);
    };
    VideoAdUnit.prototype.onKeyEvent = function (e) {
        4 !== e || this.isVideoActive() || this.hide();
    };
    VideoAdUnit.prototype.hide = function () {
        var me = this;
        if(this.isVideoActive()){
            this._nativeBridge.VideoPlayer.stop();
        }
        this.hideChildren();
        this.unsetReferences();
        this._nativeBridge.Listener.sendFinishEvent(this.getPlacement().getId(), this.getFinishState());

        if(this._nativeBridge.getPlatform() === Platform.IOS){
            this._nativeBridge.IosAdUnit.onViewControllerDidAppear.unsubscribe(this._onViewControllerDidAppearObserver);
            this._nativeBridge.Notification.onNotification.unsubscribe(this._onNotificationObserver);
            this._nativeBridge.Notification.removeNotificationObserver(VideoAdUnit._audioSessionInterrupt);
            this._nativeBridge.Notification.removeNotificationObserver(VideoAdUnit._audioSessionRouteChange);
            return this._nativeBridge.IosAdUnit.close().then(function () {
                me._showing = false;
                me.onClose.trigger();
            })
        }else{
            this._nativeBridge.AndroidAdUnit.onResume.unsubscribe(this._onResumeObserver);
            this._nativeBridge.AndroidAdUnit.onPause.unsubscribe(this._onPauseObserver);
            this._nativeBridge.AndroidAdUnit.onDestroy.unsubscribe(this._onDestroyObserver);
            this._nativeBridge.AndroidAdUnit.onKeyDown.unsubscribe(this._onBackKeyObserver);
            return this._nativeBridge.AndroidAdUnit.close().then(function () {
                me._showing = false;
                me.onClose.trigger();
            });
        }
    };
    VideoAdUnit.prototype.hideChildren = function () {
        this.getOverlay().container().parentElement.removeChild(this.getOverlay().container());
        this.getEndScreen().container().parentElement.removeChild(this.getEndScreen().container());
    };
    VideoAdUnit.prototype.setNativeOptions = function (options) {
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            this._iosOptions = options
        } else {
            this._androidOptions = options;
        }
    };
    VideoAdUnit.prototype.isShowing = function () {
        return this._showing;
    };
    VideoAdUnit.prototype.getWatches = function () {
        return this._watches;
    };
    VideoAdUnit.prototype.getVideoDuration = function () {
        return this._videoDuration;
    };
    VideoAdUnit.prototype.setVideoDuration = function (duration) {
        this._videoDuration = duration;
    };
    VideoAdUnit.prototype.getVideoPosition = function () {
        return this._videoPosition;
    };
    VideoAdUnit.prototype.setVideoPosition = function (position) {
        this._videoPosition = position;
        if(this._videoDuration){
            this._videoQuartile = Math.floor(4 * this._videoPosition / this._videoDuration);
        }
    };
    VideoAdUnit.prototype.getVideoQuartile = function () {
        return this._videoQuartile;
    };
    VideoAdUnit.prototype.isVideoActive = function () {
        return this._videoActive;
    };
    VideoAdUnit.prototype.setVideoActive = function (active) {
        this._videoActive = active;
    };
    VideoAdUnit.prototype.setWatches = function (watches) {
        this._watches = watches;
    };
    VideoAdUnit.prototype.getOverlay = function () {
        return this._overlay;
    };
    VideoAdUnit.prototype.getEndScreen = function () {
        return this._endScreen;
    };
    VideoAdUnit.prototype.newWatch = function () {
        this._watches += 1;
    };
    VideoAdUnit.prototype.unsetReferences = function () {
        this._endScreen = null, this._overlay = null;
    };
    VideoAdUnit.prototype.onResume = function (e) {
        if(this._showing && this.isVideoActive() && e === this._activityId){
            this._nativeBridge.VideoPlayer.prepare(this.getCampaign().getVideoUrl(), new Double(this.getPlacement().muteVideo() ? 0 : 1));
        }
    };
    VideoAdUnit.prototype.onPause = function (e, t) {
        if(e && this._showing && t === this._activityId ){
            this.setFinishState(FinishState.SKIPPED);
            this.hide();
        }
    };
    VideoAdUnit.prototype.onDestroy = function (e, t) {
        if(this._showing && e && t === this._activityId){
            this.setFinishState(FinishState.SKIPPED);
            this.hide();
        }
    };
    VideoAdUnit.prototype.onViewDidAppear = function () {
        if(this._showing && this.isVideoActive() ){
            this._nativeBridge.VideoPlayer.prepare(this.getCampaign().getVideoUrl(), new Double(this.getPlacement().muteVideo() ? 0 : 1));
        }
    };
    VideoAdUnit.prototype.onNotification = function (e, t) {
        switch (e) {
            case VideoAdUnit._appDidBecomeActive:
                if(this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Resuming OneWay SDK video playback, app is active");
                    this._nativeBridge.VideoPlayer.play();
                }
                break;

            case VideoAdUnit._audioSessionInterrupt:
                var n = t;
                if(0 === n.AVAudioSessionInterruptionTypeKey && 1 === n.AVAudioSessionInterruptionOptionKey && this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Resuming OneWay SDK video playback after audio interrupt");
                    this._nativeBridge.VideoPlayer.play();
                }
                break;

            case VideoAdUnit._audioSessionRouteChange:
                if(this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Continuing OneWay SDK video playback after audio session route change");
                    this._nativeBridge.VideoPlayer.play();
                }
        }
    };
    VideoAdUnit._appDidBecomeActive = "UIApplicationDidBecomeActiveNotification";
    VideoAdUnit._audioSessionInterrupt = "AVAudioSessionInterruptionNotification";
    VideoAdUnit._audioSessionRouteChange = "AVAudioSessionRouteChangeNotification";
    VideoAdUnit._activityIdCounter = 1;

    return VideoAdUnit;
});
