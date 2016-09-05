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
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                this.sendThirdPartyEvent(eventManager, "vast impression", sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendTrackingEvent = function (eventManager, eventName, sessionId) {
        var urls = this.getVast().getTrackingEventUrls(eventName);
        if (urls){
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                this.sendThirdPartyEvent(eventManager, "vast " + eventName, sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendProgressEvents = function (eventManager, sessionId, n, position) {
        this.sendQuartileEvent(eventManager, sessionId, n, position, 1);
        this.sendQuartileEvent(eventManager, sessionId, n, position, 2);
        this.sendQuartileEvent(eventManager, sessionId, n, position, 3);
    };
    VastAdUnit.prototype.getVideoClickThroughURL = function () {
        var url = this.getVast().getVideoClickThroughURL(),
            isHttps = new RegExp("^(https?)://.+$");
        return isHttps.test(url) ? url : null;
    };
    VastAdUnit.prototype.sendVideoClickTrackingEvent = function (eventManager, sessionId) {
        var urls = this.getVast().getVideoClickTrackingURLs();
        if (urls) {
            for (var i = 0; i < urls.length; i++) {
                this.sendThirdPartyEvent(eventManager, "vast video click", sessionId, urls[i]);
            }
        }
    };
    VastAdUnit.prototype.sendQuartileEvent = function (eventManager, sessionId, n, position, point) {
        var eventName;
        if(1 === point){
            eventName = "firstQuartile";
        }else if(2 === point){
            eventName = "midpoint";
        }else if(3 === point){
            eventName = "thirdQuartile";
        }
        if (this.getTrackingEventUrls(eventName)) {
            var duration = this.getDuration();
            if(duration > 0 && n / 1e3 > .25 * duration * point && .25 * duration * point > position / 1e3){
                this.sendTrackingEvent(eventManager, eventName, sessionId);
            }
        }
    };
    VastAdUnit.prototype.sendThirdPartyEvent = function (eventManager, eventName, sessionId, eventUrl) {
        eventUrl = eventUrl.replace(/%ZONE%/, this.getPlacement().getId());
        eventManager.thirdPartyEvent(eventName, sessionId, eventUrl);
    };
    /**
     * 根据事件名称返回对应的跟踪链接
     * @param event {String} 事件名称
     * @returns {String}
     */
    VastAdUnit.prototype.getTrackingEventUrls = function (event) {
        return this.getVast().getTrackingEventUrls(event);
    };
    return VastAdUnit;
});