/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.CampaignManager", function (require) {
    var Campaign = require("campaign.Campaign");
    var VastCampaign = require("campaign.VastCampaign");
    var JsonParser = require("util.JsonParser");
    var MetaDataManager = require("metadata.MetaDataManager");
    var Platform = require("platform.Platform");
    var Url = require("util.Url");
    var Observable = require("util.observable");

    function CampaignManager(nativeBridge, request, clientInfo, deviceInfo, vastParser) {
        this.onCampaign = new Observable.Observable1();
        this.onVastCampaign = new Observable.Observable1();
        this.onNoFill = new Observable.Observable1();
        this.onError = new Observable.Observable1();
        this._nativeBridge = nativeBridge;
        this._request = request;
        this._clientInfo = clientInfo;
        this._deviceInfo = deviceInfo;
        this._vastParser = vastParser;
    }
    CampaignManager.setTestBaseUrl = function (baseUrl) {
        CampaignManager.CampaignBaseUrl = baseUrl + "/games";
    };
    CampaignManager.prototype.request = function () {
        var me = this;
        return Promise.all([this.createRequestUrl(), this.createRequestBody()]).then(function (t) {
            var n = t[0], a = t[1];
            me._nativeBridge.Sdk.logInfo("Requesting ad plan from " + n);
            return me._request.post(n, a, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: !1,
                retryWithConnectionEvents: !0
            }).then(function (t) {
                var n = JsonParser.parse(t.response);
                if (n.campaign) {
                    me._nativeBridge.Sdk.logInfo("Unity Ads server returned game advertisement");
                    var a = new Campaign(n.campaign, n.gamerId, n.abGroup);
                    me.onCampaign.trigger(a);
                } else if("vast" in n ){
                    if(null === n.vast){
                        me._nativeBridge.Sdk.logInfo("Unity Ads server returned no fill");
                        me.onNoFill.trigger(3600)
                    }else{
                        me._nativeBridge.Sdk.logInfo("Unity Ads server returned VAST advertisement");
                        me._vastParser.retrieveVast(n.vast, me._nativeBridge, me._request).then(function (t) {
                            var i = void 0;
                            if(me._nativeBridge.getPlatform() === Platform.IOS){
                                i = "00005472656d6f7220694f53";
                            }else if(me._nativeBridge.getPlatform() === Platform.ANDROID){
                                i = "005472656d6f7220416e6472";
                            }

                            var a = new VastCampaign(t, i, n.gamerId, n.abGroup);
                            if(0 === a.getVast().getImpressionUrls().length){
                                me.onError.trigger(new Error("Campaign does not have an impression url"))

                            }else{
                                if(0 === a.getVast().getErrorURLTemplates().length){
                                    me._nativeBridge.Sdk.logWarning("Campaign does not have an error url for game id " + me._clientInfo.getGameId())
                                }
                                if(a.getVideoUrl()){
                                    me.onVastCampaign.trigger(a)
                                }else{
                                    me.onError.trigger(new Error("Campaign does not have a video url"))
                                }
                            }


                        })["catch"](function (t) {
                            me.onError.trigger(t);
                        })
                    }
                }else{
                    me._nativeBridge.Sdk.logInfo("Unity Ads server returned no fill");
                    me.onNoFill.trigger(3600);
                }
            });
        })["catch"](function (t) {
            me.onError.trigger(t);
        });
    };
    CampaignManager.prototype.createRequestUrl = function () {
        var t = [CampaignManager.CampaignBaseUrl, this._clientInfo.getGameId(), "fill"].join("/");

        if(this._deviceInfo.getAdvertisingIdentifier() ){
            t = Url.addParameters(t, {
                advertisingTrackingId: this._deviceInfo.getAdvertisingIdentifier(),
                limitAdTracking: this._deviceInfo.getLimitAdTracking()
            })
        }else if(this._clientInfo.getPlatform() === Platform.ANDROID){
            t = Url.addParameters(t, {
                androidId: this._deviceInfo.getAndroidId()
            })
        }

        t = Url.addParameters(t, {
            deviceMake: this._deviceInfo.getManufacturer(),
            deviceModel: this._deviceInfo.getModel(),
            platform: Platform[this._clientInfo.getPlatform()].toLowerCase(),
            screenDensity: this._deviceInfo.getScreenDensity(),
            screenWidth: this._deviceInfo.getScreenWidth(),
            screenHeight: this._deviceInfo.getScreenHeight(),
            sdkVersion: this._clientInfo.getSdkVersion(),
            screenSize: this._deviceInfo.getScreenLayout()
        });

        if("undefined" != typeof navigator && navigator.userAgent ){
            t = Url.addParameters(t, {
                webviewUa: encodeURIComponent(navigator.userAgent)
            });
        }

        if(this._clientInfo.getPlatform() === Platform.IOS){
            t = Url.addParameters(t, {osVersion: this._deviceInfo.getOsVersion()})
        }else{
            t = Url.addParameters(t, {apiLevel: this._deviceInfo.getApiLevel()});
        }

        if(this._clientInfo.getTestMode()){
            t = Url.addParameters(t, {test: !0});
        }
        var i = [];
        i.push(this._deviceInfo.getConnectionType());
        i.push(this._deviceInfo.getNetworkType());
        return Promise.all(i).then(function (e) {
            var i = e[0], r = e[1];
            return t = Url.addParameters(t, {
                connectionType: i,
                networkType: r
            });
        });
    };
    CampaignManager.prototype.createRequestBody = function () {
        var me = this,
            t = [];
        t.push(this._deviceInfo.getFreeSpace());
        t.push(this._deviceInfo.getNetworkOperator());
        t.push(this._deviceInfo.getNetworkOperatorName());
        var n = {
            bundleVersion: this._clientInfo.getApplicationVersion(),
            bundleId: this._clientInfo.getApplicationName(),
            language: this._deviceInfo.getLanguage(),
            timeZone: this._deviceInfo.getTimeZone()
        };
        return Promise.all(t).then(function (t) {
            var i = t[0], r = t[1], o = t[2];
            n.deviceFreeSpace = i;
            n.networkOperator = r;
            n.networkOperatorName = o;
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (e) {
                e && (n.mediation = e.getDTO());
                return JSON.stringify(n);
            });
        });
    };
    CampaignManager.CampaignBaseUrl = "https://adserver.unityads.unity3d.com/games";
    return CampaignManager;
});
