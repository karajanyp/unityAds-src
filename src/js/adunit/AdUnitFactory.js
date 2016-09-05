/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.AdUnitFactory", function (require) {
    var VastCampaign = require("campaign.VastCampaign");
    var Overlay = require("adunit.view.Overlay");
    var EndScreen = require("adunit.view.EndScreen");
    var VideoAdUnit = require("adunit.VideoAdUnit");
    var VastAdUnit = require("adunit.VastAdUnit");
    var Platform = require("platform.Platform");
    var VastVideoEventHandlers = require("adunit.eventhandlers.VastVideoEventHandlers");
    var VideoEventHandlers = require("adunit.eventhandlers.VideoEventHandlers");
    var EndScreenEventHandlers = require("adunit.eventhandlers.EndScreenEventHandlers");
    var VastOverlayEventHandlers = require("adunit.eventhandlers.VastOverlayEventHandlers");
    var OverlayEventHandlers = require("adunit.eventhandlers.OverlayEventHandlers");


    function AdUnitFactory() {
    }
    AdUnitFactory.createAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        if(campaign instanceof VastCampaign){
            return this.createVastAdUnit(nativeBridge, sessionManager, placement, campaign, configuration);
        }else{
            return this.createVideoAdUnit(nativeBridge, sessionManager, placement, campaign, configuration);
        }
    };
    AdUnitFactory.createVideoAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        var overlay = new Overlay(placement.muteVideo()),
            endScreen = new EndScreen(campaign, configuration.isCoppaCompliant()),
            videoAdUnit = new VideoAdUnit(nativeBridge, placement, campaign, overlay, endScreen);

        this.prepareOverlay(overlay, nativeBridge, sessionManager, videoAdUnit, placement, campaign);
        this.prepareEndScreen(endScreen, nativeBridge, sessionManager, videoAdUnit);
        this.prepareVideoPlayer(nativeBridge, sessionManager, videoAdUnit);
        return videoAdUnit;
    };
    AdUnitFactory.createVastAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        var overlay = new Overlay(placement.muteVideo()),
            vastAdUnit = new VastAdUnit(nativeBridge, placement, campaign, overlay);

        this.prepareOverlay(overlay, nativeBridge, sessionManager, vastAdUnit, placement, campaign);
        this.prepareVideoPlayer(nativeBridge, sessionManager, vastAdUnit);
        return vastAdUnit;
    };
    AdUnitFactory.prepareOverlay = function (overlay, nativeBridge, sessionManager, adUnit, placement, campaign) {
        overlay.render();
        document.body.appendChild(overlay.container());
        this.prepareOverlayEventHandlers(overlay, nativeBridge, sessionManager, adUnit);
        overlay.setSpinnerEnabled(!campaign.isVideoCached());
        if( placement.allowSkip() ){
            overlay.setSkipEnabled(true);
            overlay.setSkipDuration(placement.allowSkipInSeconds())
        }else{
            overlay.setSkipEnabled(false);
        }
    };
    AdUnitFactory.prepareOverlayEventHandlers = function (overlay, nativeBridge, sessionManager, adUnit) {
        if(adUnit instanceof VastAdUnit){
            overlay.onSkip.subscribe(function (e) {
                return VastOverlayEventHandlers.onSkip(nativeBridge, sessionManager, adUnit);
            });
            overlay.onMute.subscribe(function (e) {
                return VastOverlayEventHandlers.onMute(nativeBridge, sessionManager, adUnit, e);
            });
            overlay.onCallButton.subscribe(function () {
                return VastOverlayEventHandlers.onCallButton(nativeBridge, sessionManager, adUnit);
            })
        }else{
            overlay.onSkip.subscribe(function (e) {
                return OverlayEventHandlers.onSkip(nativeBridge, sessionManager, adUnit);
            });
            overlay.onMute.subscribe(function (e) {
                return OverlayEventHandlers.onMute(nativeBridge, sessionManager, adUnit, e);
            });
        }
    };
    AdUnitFactory.prepareEndScreen = function (endScreen, nativeBridge, sessionManager, adUnit) {
        endScreen.render();
        endScreen.hide();
        document.body.appendChild(endScreen.container());
        endScreen.onDownload.subscribe(function () {
            return EndScreenEventHandlers.onDownload(nativeBridge, sessionManager, adUnit);
        });
        endScreen.onPrivacy.subscribe(function (e) {
            return EndScreenEventHandlers.onPrivacy(nativeBridge, e);
        });
        endScreen.onClose.subscribe(function () {
            return EndScreenEventHandlers.onClose(nativeBridge, adUnit);
        });
    };
    AdUnitFactory.prepareVideoPlayer = function (nativeBridge, sessionManager, adUnit) {
        var r, o;
        var a = nativeBridge.VideoPlayer.onPrepared.subscribe(function (t, n, r) {
            return VideoEventHandlers.onVideoPrepared(nativeBridge, adUnit, t);
        });
        var u = nativeBridge.VideoPlayer.onProgress.subscribe(function (n) {
            return VideoEventHandlers.onVideoProgress(nativeBridge, sessionManager, adUnit, n);
        });
        var l = nativeBridge.VideoPlayer.onPlay.subscribe(function () {
            return VideoEventHandlers.onVideoStart(nativeBridge, sessionManager, adUnit);
        });

        if(adUnit instanceof VastAdUnit){
            r = nativeBridge.VideoPlayer.onCompleted.subscribe(function (n) {
                return VastVideoEventHandlers.onVideoCompleted(nativeBridge, sessionManager, adUnit);
            });
            o = nativeBridge.VideoPlayer.onError.subscribe(function (t, n, r) {
                return VastVideoEventHandlers.onVideoError(nativeBridge, adUnit, t, n);
            })
        }else{
            r = nativeBridge.VideoPlayer.onCompleted.subscribe(function (n) {
                return VideoEventHandlers.onVideoCompleted(nativeBridge, sessionManager, adUnit);
            });
            o = nativeBridge.VideoPlayer.onError.subscribe(function (t, n, r) {
                return VideoEventHandlers.onVideoError(nativeBridge, adUnit, t, n);
            });
        }

        adUnit.onClose.subscribe(function () {
            nativeBridge.VideoPlayer.onPrepared.unsubscribe(a);
            nativeBridge.VideoPlayer.onProgress.unsubscribe(u);
            nativeBridge.VideoPlayer.onPlay.unsubscribe(l);
            nativeBridge.VideoPlayer.onCompleted.unsubscribe(r);
            nativeBridge.VideoPlayer.onError.unsubscribe(o);
        });

        if ( nativeBridge.getPlatform() === Platform.IOS) {
            var p = nativeBridge.VideoPlayer.Ios.onLikelyToKeepUp.subscribe(function (t, n) {
                n === true && nativeBridge.VideoPlayer.play();
            });
            adUnit.onClose.subscribe(function () {
                nativeBridge.VideoPlayer.Ios.onLikelyToKeepUp.unsubscribe(p);
            });
        }
    };

    return AdUnitFactory;
});