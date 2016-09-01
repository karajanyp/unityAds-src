/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.VastAdUnit", function (require) {
    var VideoAdUnit = require("adunit.VideoAdUnit");

    function VastAdUnit(nativeBridge, placement, campaign, overlay) {
        VideoAdUnit.call(this, nativeBridge, placement, campaign, overlay, null);
    }
    extend(VastAdUnit, VideoAdUnit);
    VastAdUnit.prototype.hideChildren = function () {
        var overlay = this.getOverlay();
        overlay.container().parentElement.removeChild(overlay.container());
    };
    VastAdUnit.prototype.getVast = function () {
        return this.getCampaign().getVast();
    };
    VastAdUnit.prototype.getDuration = function () {
        return this.getVast().getDuration();
    };
    VastAdUnit.prototype.sendImpressionEvent = function (eventManager, sessionId) {
        var urls = this.getVast().getImpressionUrls();
        if (urls){
            for (var i = 0, r = urls; i < r.length; i++) {
                var url = r[i];
                this.sendThirdPartyEvent(eventManager, "vast impression", sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendTrackingEvent = function (eventManager, eventName, sessionId) {
        var urls = this.getVast().getTrackingEventUrls(eventName);
        if (urls){
            for (var r = 0, o = urls; r < o.length; r++) {
                var url = o[r];
                this.sendThirdPartyEvent(eventManager, "vast " + eventName, sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendProgressEvents = function (e, t, n, i) {
        this.sendQuartileEvent(e, t, n, i, 1);
        this.sendQuartileEvent(e, t, n, i, 2);
        this.sendQuartileEvent(e, t, n, i, 3);
    };
    VastAdUnit.prototype.getVideoClickThroughURL = function () {
        var e = this.getVast().getVideoClickThroughURL(), t = new RegExp("^(https?)://.+$");
        return t.test(e) ? e : null;
    };
    VastAdUnit.prototype.sendVideoClickTrackingEvent = function (e, t) {
        var n = this.getVast().getVideoClickTrackingURLs();
        if (n) for (var i = 0; i < n.length; i++) this.sendThirdPartyEvent(e, "vast video click", t, n[i]);
    };
    VastAdUnit.prototype.sendQuartileEvent = function (e, t, n, i, r) {
        var o;
        1 === r && (o = "firstQuartile");
        2 === r && (o = "midpoint");
        3 === r && (o = "thirdQuartile");
        if (this.getTrackingEventUrls(o)) {
            var a = this.getDuration();
            if(a > 0 && n / 1e3 > .25 * a * r && .25 * a * r > i / 1e3){
                this.sendTrackingEvent(e, o, t);
            }
        }
    };
    VastAdUnit.prototype.sendThirdPartyEvent = function (e, t, n, i) {
        i = i.replace(/%ZONE%/, this.getPlacement().getId());
        e.thirdPartyEvent(t, n, i);
    };
    VastAdUnit.prototype.getTrackingEventUrls = function (e) {
        return this.getVast().getTrackingEventUrls(e);
    };
    return VastAdUnit;
});