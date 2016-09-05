/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.Campaign", function () {
    function Campaign(campaign, gamerId, abGroup) {
        this._isVideoCached = false;
        this._id = campaign.id;
        this._appStoreId = campaign.appStoreId;
        this._appStoreCountry = campaign.appStoreCountry;
        this._gameId = campaign.gameId;
        this._gameName = campaign.gameName;
        this._gameIcon = campaign.gameIcon;
        this._rating = campaign.rating;
        this._ratingCount = campaign.ratingCount;
        this._landscapeImage = campaign.endScreenLandscape;
        this._portraitImage = campaign.endScreenPortrait;
        this._video = campaign.trailerDownloadable;
        this._videoSize = campaign.trailerDownloadableSize;
        this._streamingVideo = campaign.trailerStreaming;
        this._clickAttributionUrl = campaign.clickAttributionUrl;
        this._clickAttributionUrlFollowsRedirects = campaign.clickAttributionUrlFollowsRedirects;
        this._bypassAppSheet = campaign.bypassAppSheet;
        this._gamerId = gamerId;
        this._abGroup = abGroup;
    }
    Campaign.prototype.getId = function () {
        return this._id;
    };
    Campaign.prototype.getAppStoreId = function () {
        return this._appStoreId;
    };
    Campaign.prototype.getAppStoreCountry = function () {
        return this._appStoreCountry;
    };
    Campaign.prototype.getGameId = function () {
        return this._gameId;
    };
    Campaign.prototype.getGameName = function () {
        return this._gameName;
    };
    Campaign.prototype.getGameIcon = function () {
        return this._gameIcon;
    };
    Campaign.prototype.setGameIcon = function (icon) {
        this._gameIcon = icon;
    };
    Campaign.prototype.getRating = function () {
        return this._rating;
    };
    Campaign.prototype.getRatingCount = function () {
        return this._ratingCount;
    };
    Campaign.prototype.getPortraitUrl = function () {
        return this._portraitImage;
    };
    Campaign.prototype.setPortraitUrl = function (imgUrl) {
        this._portraitImage = imgUrl;
    };
    Campaign.prototype.getLandscapeUrl = function () {
        return this._landscapeImage;
    };
    Campaign.prototype.setLandscapeUrl = function (url) {
        this._landscapeImage = url;
    };
    Campaign.prototype.getVideoUrl = function () {
        return this._video;
    };
    Campaign.prototype.setVideoUrl = function (url) {
        this._video = url;
    };
    Campaign.prototype.getClickAttributionUrl = function () {
        return this._clickAttributionUrl;
    };
    Campaign.prototype.getClickAttributionUrlFollowsRedirects = function () {
        return this._clickAttributionUrlFollowsRedirects;
    };
    Campaign.prototype.getBypassAppSheet = function () {
        return this._bypassAppSheet;
    };
    Campaign.prototype.getGamerId = function () {
        return this._gamerId;
    };
    Campaign.prototype.getAbGroup = function () {
        return this._abGroup;
    };
    Campaign.prototype.isVideoCached = function () {
        return this._isVideoCached;
    };
    Campaign.prototype.setVideoCached = function (cached) {
        this._isVideoCached = cached;
    };
    return Campaign;
});
