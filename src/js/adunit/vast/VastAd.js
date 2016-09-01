/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastAd", function (require) {
    var VastCreativeLinear = require("adunit.vast.VastCreativeLinear");

    var VastAd = function () {
        function VastAd(id, creatives, errorURLTemplates, impressionURLTemplates, wrapperURLs) {
            this._id = id;
            this._creatives = creatives || [];
            this._errorURLTemplates = errorURLTemplates || [];
            this._impressionURLTemplates = impressionURLTemplates || [];
            this._wrapperURLs = wrapperURLs || [];
        }
        VastAd.prototype.getId = function () {
            return this._id;
        };
        VastAd.prototype.setId = function (id) {
            this._id = id;
        };
        VastAd.prototype.getCreatives = function () {
            return this._creatives;
        };
        VastAd.prototype.getCreative = function () {
            if(this.getCreatives() && this.getCreatives().length > 0){
                return this.getCreatives()[0];
            }else{
                return null;
            }
        };
        VastAd.prototype.addCreative = function (creative) {
            this._creatives.push(creative);
        };
        VastAd.prototype.getErrorURLTemplates = function () {
            return this._errorURLTemplates;
        };
        VastAd.prototype.addErrorURLTemplate = function (template) {
            this._errorURLTemplates.push(template);
        };
        VastAd.prototype.getImpressionURLTemplates = function () {
            return this._impressionURLTemplates;
        };
        VastAd.prototype.addImpressionURLTemplate = function (template) {
            this._impressionURLTemplates.push(template);
        };
        VastAd.prototype.getWrapperURL = function () {
            return this._wrapperURLs[0];
        };
        VastAd.prototype.addWrapperURL = function (url) {
            this._wrapperURLs.push(url);
        };
        VastAd.prototype.getTrackingEventUrls = function (eventName) {
            var creative = this.getCreative();
            if(creative && creative.getTrackingEvents()){
                return creative.getTrackingEvents()[eventName];
            }else{
                return null;
            }
        };
        VastAd.prototype.getDuration = function () {
            var creative = this.getCreative();
            if(creative){
                return creative.getDuration()
            }else{
                return null;
            }
        };
        VastAd.prototype.getVideoClickThroughURLTemplate = function () {
            var creative = this.getCreative();
            if(creative instanceof VastCreativeLinear){
                return creative.getVideoClickThroughURLTemplate();
            }else{
                return null;
            }
        };
        VastAd.prototype.getVideoClickTrackingURLTemplates = function () {
            var creative = this.getCreative();
            if(creative instanceof VastCreativeLinear){
                return creative.getVideoClickTrackingURLTemplates()
            } else{
                null;
            }
        };
        VastAd.prototype.addVideoClickTrackingURLTemplate = function (e) {
            var creative = this.getCreative();
            if(creative instanceof VastCreativeLinear ){
                creative.addVideoClickTrackingURLTemplate(e);
            }
        };
        return VastAd;
    }();
    exports.VastAd = VastAd;
    return exports;
});