/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.VastCampaign", function (require) {
    var Campaign = require("campaign.Campaign");

    function VastCampaign(vast, campaignId, gamerId, abGroup) {
        Campaign.call(this, {}, gamerId, abGroup);
        this._campaignId = campaignId;
        this._vast = vast;
    }
    extend(VastCampaign, Campaign);

    VastCampaign.prototype.getId = function () {
        return this._campaignId;
    };
    VastCampaign.prototype.getVast = function () {
        return this._vast;
    };
    VastCampaign.prototype.getVideoUrl = function () {
        var url = Campaign.prototype.getVideoUrl.call(this);
        return url ? url : this._vast.getVideoUrl();
    };
    return VastCampaign;
});
