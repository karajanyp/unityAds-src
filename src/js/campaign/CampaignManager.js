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
    var Observable = require("util.Observable");
    var campaignProperties = require("Properties").campaign;

    function CampaignManager(nativeBridge, request, clientInfo, deviceInfo, vastParser) {
        this.onCampaign = new Observable();
        this.onVastCampaign = new Observable();
        this.onNoFill = new Observable();
        this.onError = new Observable();
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
        return Promise.all([this.createRequestUrl(), this.createRequestBody()]).then(function (res) {
            var requestUrl = res[0],
                requestBody = res[1];
            me._nativeBridge.Sdk.logInfo("Requesting ad plan from " + requestUrl);
            return me._request.post(requestUrl, requestBody, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: false,
                retryWithConnectionEvents: true
            }).then(function (data) {
                var response = JsonParser.parse(data.response);
                if (response.campaign) {
                    me._nativeBridge.Sdk.logInfo("OneWay SDK server returned game advertisement");
                    var campaign = new Campaign(response.campaign, response.gamerId, response.abGroup);
                    me.onCampaign.trigger(campaign);
                } else if("vast" in response ){
                    if(null === response.vast){
                        me._nativeBridge.Sdk.logInfo("OneWay SDK server returned no fill");
                        me.onNoFill.trigger(3600)
                    }else{
                        me._nativeBridge.Sdk.logInfo("OneWay SDK server returned VAST advertisement");
                        me._vastParser.retrieveVast(response.vast, me._nativeBridge, me._request).then(function (vastData) {
                            var campaignId = void 0;
                            if(me._nativeBridge.getPlatform() === Platform.IOS){
                                campaignId = "00005472656d6f7220694f53";
                            }else if(me._nativeBridge.getPlatform() === Platform.ANDROID){
                                campaignId = "005472656d6f7220416e6472";
                            }

                            var vastCampaign = new VastCampaign(vastData, campaignId, response.gamerId, response.abGroup);
                            if(0 === vastCampaign.getVast().getImpressionUrls().length){
                                me.onError.trigger(new Error("Campaign does not have an impression url"))

                            }else{
                                if(0 === vastCampaign.getVast().getErrorURLTemplates().length){
                                    me._nativeBridge.Sdk.logWarning("Campaign does not have an error url for game id " + me._clientInfo.getGameId())
                                }
                                if(vastCampaign.getVideoUrl()){
                                    me.onVastCampaign.trigger(vastCampaign)
                                }else{
                                    me.onError.trigger(new Error("Campaign does not have a video url"))
                                }
                            }


                        })["catch"](function (e) {
                            me.onError.trigger(e);
                        })
                    }
                }else{
                    me._nativeBridge.Sdk.logInfo("OneWay SDK server returned no fill");
                    me.onNoFill.trigger(3600);
                }
            });
        })["catch"](function (e) {
            me.onError.trigger(e);
        });
    };
    CampaignManager.prototype.createRequestUrl = function () {
        var requestUrl = [CampaignManager.CampaignBaseUrl, this._clientInfo.getGameId(), "fill"].join("/");

        if(this._deviceInfo.getAdvertisingIdentifier() ){
            requestUrl = Url.addParameters(requestUrl, {
                advertisingTrackingId: this._deviceInfo.getAdvertisingIdentifier(),
                limitAdTracking: this._deviceInfo.getLimitAdTracking()
            })
        }else if(this._clientInfo.getPlatform() === Platform.ANDROID){
            requestUrl = Url.addParameters(requestUrl, {
                androidId: this._deviceInfo.getAndroidId()
            })
        }

        requestUrl = Url.addParameters(requestUrl, {
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
            requestUrl = Url.addParameters(requestUrl, {
                webviewUa: encodeURIComponent(navigator.userAgent)
            });
        }

        if(this._clientInfo.getPlatform() === Platform.IOS){
            requestUrl = Url.addParameters(requestUrl, {osVersion: this._deviceInfo.getOsVersion()})
        }else{
            requestUrl = Url.addParameters(requestUrl, {apiLevel: this._deviceInfo.getApiLevel()});
        }

        if(this._clientInfo.getTestMode()){
            requestUrl = Url.addParameters(requestUrl, {test: true});
        }
        var tasks = [];
        tasks.push(this._deviceInfo.getConnectionType());
        tasks.push(this._deviceInfo.getNetworkType());
        return Promise.all(tasks).then(function (res) {
            var connectionType = res[0], networkType = res[1];
            return requestUrl = Url.addParameters(requestUrl, {
                connectionType: connectionType,
                networkType: networkType
            });
        });
    };
    CampaignManager.prototype.createRequestBody = function () {
        var me = this,
            tasks = [];
        tasks.push(this._deviceInfo.getFreeSpace());
        tasks.push(this._deviceInfo.getNetworkOperator());
        tasks.push(this._deviceInfo.getNetworkOperatorName());
        var params = {
            bundleVersion: this._clientInfo.getApplicationVersion(),
            bundleId: this._clientInfo.getApplicationName(),
            language: this._deviceInfo.getLanguage(),
            timeZone: this._deviceInfo.getTimeZone()
        };
        return Promise.all(tasks).then(function (res) {
            var deviceFreeSpace = res[0],
                networkOperator = res[1],
                networkOperatorName = res[2];
            params.deviceFreeSpace = deviceFreeSpace;
            params.networkOperator = networkOperator;
            params.networkOperatorName = networkOperatorName;
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (metaData) {
                metaData && (params.mediation = metaData.getDTO());
                return JSON.stringify(params);
            });
        });
    };
    CampaignManager.CampaignBaseUrl = campaignProperties.CAMPAIGN_BASE_URL;
    return CampaignManager;
});
