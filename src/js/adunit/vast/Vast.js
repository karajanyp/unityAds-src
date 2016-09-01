/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.Vast", function () {

    function Vast(ads, urlTemplates, additionalTrackingEvents) {
        this._ads = ads;
        this._errorURLTemplates = urlTemplates;
        this._additionalTrackingEvents = additionalTrackingEvents;
    }
    Vast.prototype.getAds = function () {
        return this._ads;
    };
    Vast.prototype.getErrorURLTemplates = function () {
        var ad = this.getAd();
        if (ad) {
            var templates = ad.getErrorURLTemplates();
            if (templates instanceof Array){
                return templates.concat(this._errorURLTemplates || []);
            }
        }
        return this._errorURLTemplates;
    };
    Vast.prototype.getAd = function () {
        if(this.getAds() && this.getAds().length > 0){
            return this.getAds()[0];
        }else{
            return null;
        }
    };
    Vast.prototype.getVideoUrl = function () {
        var ad = this.getAd();
        if (ad) {
            var creatives = ad.getCreatives();
            for (var i = 0;  i < creatives.length; i++) {
                var creative = creatives[i], files = creative.getMediaFiles();
                for (var  j = 0; j < files.length; j++) {
                    var file = files[j],
                        isPlayable = this.isPlayableMIMEType(file.getMIMEType());
                    if (file.getFileURL() && isPlayable){
                        return file.getFileURL();
                    }
                }
            }
        }
        return null;
    };
    Vast.prototype.getImpressionUrls = function () {
        var ad = this.getAd();
        return ad ? ad.getImpressionURLTemplates() : [];
    };
    Vast.prototype.getTrackingEventUrls = function (e) {
        var ad = this.getAd();
        if (ad) {
            var urls = ad.getTrackingEventUrls(e),
                additionalUrls = [];
            if(this._additionalTrackingEvents ){
                additionalUrls = this._additionalTrackingEvents[e] || [];
            }
            return urls instanceof Array ? urls.concat(additionalUrls) : additionalUrls;
        }
        return null;
    };
    //逻辑有点问题 重置了?
    Vast.prototype.addTrackingEventUrl = function (event, url) {
        if(!this._additionalTrackingEvents){
            this._additionalTrackingEvents = {};
        }
        if(!this._additionalTrackingEvents[event]){
            this._additionalTrackingEvents[event] = [];
        }
        this._additionalTrackingEvents[event].push(url);
    };
    Vast.prototype.getDuration = function () {
        var ad = this.getAd();
        return ad ? ad.getDuration() : null;
    };
    Vast.prototype.getWrapperURL = function () {
        var ad = this.getAd();
        return ad ? ad.getWrapperURL() : null;
    };
    Vast.prototype.getVideoClickThroughURL = function () {
        var ad = this.getAd();
        return ad ? ad.getVideoClickThroughURLTemplate() : null;
    };
    Vast.prototype.getVideoClickTrackingURLs = function () {
        var ad = this.getAd();
        return ad ? ad.getVideoClickTrackingURLTemplates() : null;
    };
    Vast.prototype.isPlayableMIMEType = function (mimeType) {
        var mime = "video/mp4";
        return mimeType === mime;
    };

    return Vast;
});
