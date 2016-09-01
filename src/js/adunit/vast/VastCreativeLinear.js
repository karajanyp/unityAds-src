/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastCreativeLinear", function (require) {
    var VastCreative = require("adunit.vast.VastCreative");

    function VastCreativeLinear(t, n, i, r, o, a, s) {
        VastCreative.call(this, "linear");
        this._duration = t || 0;
        this._skipDelay = n || null;
        this._mediaFiles = i || [];
        this._videoClickThroughURLTemplate = r || null;
        this._videoClickTrackingURLTemplates = o || [];
        this._videoCustomClickURLTemplates = a || [];
        this._adParameters = s || null;
    }
    extend(VastCreativeLinear, VastCreative);

    VastCreativeLinear.prototype.getDuration = function () {
        return this._duration;
    };
    VastCreativeLinear.prototype.setDuration = function (e) {
        this._duration = e;
    };
    VastCreativeLinear.prototype.getSkipDelay = function () {
        return this._skipDelay;
    };
    VastCreativeLinear.prototype.setSkipDelay = function (e) {
        this._skipDelay = e;
    };
    VastCreativeLinear.prototype.getMediaFiles = function () {
        return this._mediaFiles;
    };
    VastCreativeLinear.prototype.addMediaFile = function (e) {
        this._mediaFiles.push(e);
    };
    VastCreativeLinear.prototype.getVideoClickThroughURLTemplate = function () {
        return this._videoClickThroughURLTemplate;
    };
    VastCreativeLinear.prototype.setVideoClickThroughURLTemplate = function (e) {
        this._videoClickThroughURLTemplate = e;
    };
    VastCreativeLinear.prototype.getVideoClickTrackingURLTemplates = function () {
        return this._videoClickTrackingURLTemplates;
    };
    VastCreativeLinear.prototype.addVideoClickTrackingURLTemplate = function (e) {
        this._videoClickTrackingURLTemplates.push(e);
    };
    VastCreativeLinear.prototype.getVideoCustomClickURLTemplates = function () {
        return this._videoCustomClickURLTemplates;
    };
    VastCreativeLinear.prototype.getAdParameters = function () {
        return this._adParameters;
    };

    return VastCreativeLinear;
});
