/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.OverlayEventHandlers", function (require) {
    var ScreenOrientation = require("device.ScreenOrientation");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var FinishState = require("FinishState");
    var Double = require("util.Double");

    function OverlayEventHandlers() {
    }
    OverlayEventHandlers.onSkip = function (nativeBridge, sessionManager, adUnit) {
        nativeBridge.VideoPlayer.pause();
        adUnit.setVideoActive(false);
        adUnit.setFinishState(FinishState.SKIPPED);
        sessionManager.sendSkip(adUnit, adUnit.getVideoPosition());
        if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.IosAdUnit.setViews(["webview"])
        }else{
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.AndroidAdUnit.setOrientation(ScreenOrientation.SCREEN_ORIENTATION_FULL_SENSOR);
        }else if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.IosAdUnit.setSupportedOrientations(UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_ALL)
        }
        adUnit.getOverlay().hide();
        this.afterSkip(adUnit);
    };
    OverlayEventHandlers.afterSkip = function (adUnit) {
        adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
    };
    OverlayEventHandlers.onMute = function (nativeBridge, sessionManager, i, r) {
        nativeBridge.VideoPlayer.setVolume(new Double(r ? 0 : 1));
        sessionManager.sendMute(i, sessionManager.getSession(), r);
    };
    OverlayEventHandlers.onCallButton = function (nativeBridge, sessionManager, adUnit) {
        var url = adUnit.getVideoClickThroughURL();
        sessionManager.sendVideoClickTracking(adUnit, sessionManager.getSession());
        if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.UrlScheme.open(url)
        }else{
            nativeBridge.Intent.launch({
                action: "android.intent.action.VIEW",
                uri: url
            });
        }
    };
    return OverlayEventHandlers;
});
