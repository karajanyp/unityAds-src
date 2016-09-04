/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.SessionManager", function (require) {
    var Session = require("session.Session");
    var SessionManagerEventMetadataCreator = require("session.SessionManagerEventMetadataCreator");
    var Url = require("util.Url");

    function SessionManager(nativeBridge, clientInfo, deviceInfo, eventManager, eventMetadataCreator) {
        this._nativeBridge = nativeBridge;
        this._clientInfo = clientInfo;
        this._deviceInfo = deviceInfo;
        this._eventManager = eventManager;
        this._eventMetadataCreator = eventMetadataCreator || new SessionManagerEventMetadataCreator(this._eventManager, this._deviceInfo, this._nativeBridge);
    }
    SessionManager.setTestBaseUrl = function (baseUrl) {
        SessionManager.VideoEventBaseUrl = baseUrl + "/mobile/gamers";
        SessionManager.ClickEventBaseUrl = baseUrl + "/mobile/campaigns";
    };
    SessionManager.prototype.create = function () {
        var me = this;
        return this._eventManager.getUniqueEventId().then(function (id) {
            me._currentSession = new Session(id);
            return me._eventManager.startNewSession(id);
        });
    };
    SessionManager.prototype.getSession = function () {
        return this._currentSession;
    };
    SessionManager.prototype.setSession = function (session) {
        this._currentSession = session;
    };
    SessionManager.prototype.sendShow = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.showSent){
                return;
            }
            this._currentSession.showSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("show", eventId, metaData.sessionId, me.createShowEventUrl(adUnit), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendImpressionEvent = function (adUnit) {
        if (this._currentSession) {
            if (this._currentSession.impressionSent){
                return;
            }
            this._currentSession.impressionSent = true;
        }
        adUnit.sendImpressionEvent(this._eventManager, this._currentSession.getId());
        adUnit.sendTrackingEvent(this._eventManager, "creativeView", this._currentSession.getId());
    };
    SessionManager.prototype.sendStart = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.startSent) {
                return;
            }
            this._currentSession.startSent = true;
        }
        var sendVent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("start", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "video_start"), JSON.stringify(metaData));
            adUnit.sendTrackingEvent(me._eventManager, "start", metaData.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendVent);
    };
    SessionManager.prototype.sendProgress = function (adUnit, session, n, position) {
        session && adUnit.sendProgressEvents(this._eventManager, session.getId(), n, position);
    };
    SessionManager.prototype.sendFirstQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.firstQuartileSent){
                return;
            }
            this._currentSession.firstQuartileSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("first_quartile", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "first_quartile"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendMidpoint = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.midpointSent) {
                return;
            }
            this._currentSession.midpointSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("midpoint", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "midpoint"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendThirdQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.thirdQuartileSent){
                return;
            }
            this._currentSession.thirdQuartileSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("third_quartile", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "third_quartile"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendSkip = function (adUnit, position) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.skipSent){
                return;
            }
            this._currentSession.skipSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            //跳过时的进度
            if(position){
                metaData.skippedAt = position;
            }
            me._eventManager.operativeEvent("skip", eventId, me._currentSession.getId(), me.createVideoEventUrl(adUnit, "video_skip"), JSON.stringify(metaData));
        };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendView = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.viewSent) {
                return;
            }
            this._currentSession.viewSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("view", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "video_end"), JSON.stringify(metaData));
            adUnit.sendTrackingEvent(me._eventManager, "complete", metaData.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendClick = function (adUnit) {
        var me = this,
            campaign = adUnit.getCampaign(),
            sendEvent = function (res) {
                var eventId = res[0], metaData = res[1];
                me._eventManager.operativeEvent("click", eventId, me._currentSession.getId(), me.createClickEventUrl(adUnit), JSON.stringify(metaData));
            };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
        if(campaign.getClickAttributionUrl()){
            return this._eventManager.clickAttributionEvent(this._currentSession.getId(), campaign.getClickAttributionUrl(), campaign.getClickAttributionUrlFollowsRedirects())
        }else{
            return Promise.reject("Missing click attribution url");
        }
    };
    SessionManager.prototype.sendMute = function (adUnit, session, isMute) {
        if(isMute){
            adUnit.sendTrackingEvent(this._eventManager, "mute", session.getId())
        }else{
            adUnit.sendTrackingEvent(this._eventManager, "unmute", session.getId());
        }
    };
    SessionManager.prototype.sendVideoClickTracking = function (adUnit, session) {
        adUnit.sendVideoClickTrackingEvent(this._eventManager, session.getId());
    };
    SessionManager.prototype.setGamerServerId = function (id) {
        this._gamerServerId = id;
    };
    SessionManager.prototype.createShowEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "show", campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createVideoEventUrl = function (adUnit, eventName) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "video", eventName, campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createClickEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign(),
            r = [SessionManager.ClickEventBaseUrl, campaign.getId(), "click", campaign.getGamerId()].join("/");
        return Url.addParameters(r, {
            gameId: this._clientInfo.getGameId(),
            redirect: false
        });
    };
    SessionManager.VideoEventBaseUrl = "https://adserver.unityads.unity3d.com/mobile/gamers";
    SessionManager.ClickEventBaseUrl = "https://adserver.unityads.unity3d.com/mobile/campaigns";

    return SessionManager;
});
